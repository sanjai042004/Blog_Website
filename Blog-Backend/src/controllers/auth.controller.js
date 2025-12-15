const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const {
  createTokens,
  attachTokens,
  clearCookies,
  publicUser,
} = require("../utils/auth");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (entered, hashed) => {
  return bcrypt.compare(entered, hashed);
};

//new user
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    if (password.length < 8)
      return res
        .status(400)
        .json({ success: false, message: "Password too short" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      authProvider: "local",
    });

    const { accessToken, refreshToken } = createTokens(newUser);

    attachTokens(res, refreshToken);

    res.status(201).json({
      success: true,
      accessToken,
      user: publicUser(newUser),
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

//  Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select(
      "+password +refreshTokens"
    );
    if (!user) return res.status(401).json({ success: false });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false });

    const { accessToken, refreshToken } = createTokens(user);

    user.refreshTokens = (user.refreshTokens || []).concat(refreshToken);
    await user.save();

    attachTokens(res, refreshToken);

    res.json({
      success: true,
      accessToken,
      user: publicUser(user),
    });
  } catch {
    res.status(500).json({ success: false });
  }
};

//  Google Login
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Google token is required" });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, sub: googleId, picture } = ticket.getPayload();

    let user = await User.findOne({ email }).select("+refreshTokens");

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

    // Create tokens
    const { accessToken, refreshToken } = createTokens(user);

    // Save refresh token in DB
    user.refreshTokens = (user.refreshTokens || []).concat(refreshToken);
    await user.save();

    // Attach ONLY refresh token as cookie
    attachTokens(res, refreshToken);

    // Send access token in response
    return res.status(200).json({
      success: true,
      message: "✔️ Google login successful!",
      accessToken,
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Google Login Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error during Google login",
    });
  }
};

//  Refresh Access Token
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ success: false });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("+refreshTokens");

    if (!user || !user.refreshTokens.includes(token))
      return res.status(403).json({ success: false });

    const { accessToken, refreshToken: newRefresh } = createTokens(user);

    user.refreshTokens = user.refreshTokens
      .filter((t) => t !== token)
      .concat(newRefresh);
    await user.save();

    attachTokens(res, newRefresh);

    res.json({
      success: true,
      accessToken,
      user: publicUser(user),
    });
  } catch {
    res.status(401).json({ success: false });
  }
};

//  Logout user
const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
        await user.save();
      }
    }

    clearCookies(res);
    res.json({ success: true });
  } catch {
    clearCookies(res);
    res.json({ success: true });
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  refreshToken,
  logout,
};
