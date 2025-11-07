const User = require("../models/user.model");
// const upload = require("../../uploads/upload");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcrypt");
const {
  createTokens,
  attachTokens,
  clearCookies,
  publicUser,
} = require("../utils/auth");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (entered, hashed) => {
  return await bcrypt.compare(entered, hashed);
};

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    if (password.length < 8)
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      authProvider: "local",
    });
    await newUser.save();

    const tokens = createTokens(newUser);
    attachTokens(res, tokens);

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      accessToken: tokens.accessToken,
      user: publicUser(newUser),
    });
  } catch (err) {
    console.error("Register error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error during registration" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const tokens = createTokens(user);
    attachTokens(res, tokens);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      accessToken: tokens.accessToken,
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, sub: googleId, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: "google",
        profileImage: picture || "",
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = "google";
      await user.save();
    }

    const tokens = createTokens(user);
    attachTokens(res, tokens);

    return res.status(200).json({
      success: true,
      message: "Google login successful!",
      accessToken: tokens.accessToken,
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Google Login Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error during Google login" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(token))
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });

    const newTokens = createTokens(user);
    user.refreshTokens = user.refreshTokens
      .filter((t) => t !== token)
      .concat(newTokens.refreshToken);
    await user.save();

    attachTokens(res, newTokens);
    res.json({ success: true, user: publicUser(user) });
  } catch {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (user) {
          user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
          await user.save();
        }
      } catch (err) {
        console.warn("Invalid refresh token during logout:", err.message);
      }
    }
    clearCookies(res);
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    clearCookies(res);
    return res
      .status(500)
      .json({ success: false, message: "Server error during logout" });
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  refreshToken,
  logout,
};
