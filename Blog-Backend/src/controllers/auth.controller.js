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
  return bcrypt.hash(password, 10);
};

const comparePassword = async (entered, hashed) => {
  return bcrypt.compare(entered, hashed);
};

const register = async (req, res) => {
  try {
    let { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    email = email.trim().toLowerCase();
    name = name.trim();

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      authProvider: "local",
      refreshTokens: [],
    });

    const { accessToken, refreshToken } = createTokens(newUser);

    newUser.refreshTokens.push(refreshToken);
    await newUser.save();

    attachTokens(res, refreshToken);

    res.status(201).json({
      success: true,
      accessToken,
      user: publicUser(newUser),
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email }).select(
      "+password +refreshTokens",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.authProvider === "google") {
      return res.status(400).json({
        success: false,
        message: "Please login using Google",
      });
    }

    if (user.isDeactivated) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { accessToken, refreshToken } = createTokens(user);

    user.refreshTokens.push(refreshToken);
    await user.save();

    attachTokens(res, refreshToken);

    res.json({
      success: true,
      accessToken,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, sub: googleId, picture } = ticket.getPayload();

    const normalizedEmail = email.toLowerCase();

    let user = await User.findOne({ email: normalizedEmail }).select(
      "+refreshTokens",
    );

    if (user) {
      if (user.authProvider === "local") {
        return res.status(400).json({
          success: false,
          message: "Account exists with email/password login",
        });
      }
    } else {
      user = await User.create({
        name,
        email: normalizedEmail,
        googleId,
        authProvider: "google",
        profileImage: picture || "",
        refreshTokens: [],
      });
    }

    if (user.isDeactivated) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    const { accessToken, refreshToken } = createTokens(user);

    user.refreshTokens.push(refreshToken);
    await user.save();

    attachTokens(res, refreshToken);

    res.json({
      success: true,
      accessToken,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Google Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during Google login",
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id).select("+refreshTokens");

        if (user) {
          user.refreshTokens = user.refreshTokens.filter((t) => t !== token);

          await user.save();
        }
      } catch (err) {}
    }

    clearCookies(res);

    res.json({ success: true });
  } catch (error) {
    console.error("Logout Error:", error);

    clearCookies(res);
    res.json({ success: true });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id).select("+refreshTokens");

    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(403).json({ success: false });
    }

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
  } catch (error) {
    console.error("Refresh Token Error:", error);

    res.status(401).json({ success: false });
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  refreshToken,
  logout,
};
