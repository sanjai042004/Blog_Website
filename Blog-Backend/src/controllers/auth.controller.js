const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helpers

const buildCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",  
  };
};


const generateTokens = (user) => {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT env vars missing");
  }

  // Access = 1 hour
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Refresh = 7 days
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  const opts = buildCookieOptions();
  res.cookie("accessToken", accessToken, {
    ...opts,
    maxAge: 60 * 60 * 1000, 
  });
  res.cookie("refreshToken", refreshToken, {
    ...opts,
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
};

const clearAuthCookies = (res) => {
  const opts = buildCookieOptions();
  res.clearCookie("accessToken", opts);
  res.clearCookie("refreshToken", opts);
};

// Unified Public User

const publicUser = (user) => {
  const avatar =
    user.profileImage?.trim() ||
    (user.name ? user.name.charAt(0).toUpperCase() : "U");

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar,
    profileImage: user.profileImage || "",  
    authProvider: user.authProvider,
  };
};

const loginUser = async (res, user) => {
  const { accessToken, refreshToken } = generateTokens(user);
  user.refreshTokens.push(refreshToken);
  await user.save();
  setAuthCookies(res, accessToken, refreshToken);
  return { user: publicUser(user), accessToken };
};

// Controllers

// Register
const register = async (req, res) => {
  try {
    let { email, password, name } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    email = email.toLowerCase();
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await new User({
      name: name || email.split("@")[0],
      email,
      password: hashed,
      authProvider: "local",
    }).save();

    const { user: safeUser, accessToken } = await loginUser(res, user);
    res.status(201).json({ success: true, user: safeUser, accessToken });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login
const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });

    email = email.toLowerCase();
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    if (user.authProvider !== "local")
      return res.status(400).json({
        success: false,
        message: `Please login with ${user.authProvider}`,
      });

    const match = await bcrypt.compare(password, user.password || "");
    if (!match)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const { user: safeUser, accessToken } = await loginUser(res, user);
    res.json({ success: true, user: safeUser, accessToken });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Google login
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "Google token is required" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture, sub: googleId } = ticket.getPayload();
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Google email not available" });

    const lower = email.toLowerCase();
    let user = await User.findOne({ email: lower });

    if (user) {
      if (!user.googleId) user.googleId = googleId;
      if (!user.name && name) user.name = name;
      if (!user.profileImage || user.profileImage !== picture)
        user.profileImage = picture || user.profileImage;
      if (user.authProvider !== "local") user.authProvider = "google";
      await user.save();
    } else {
      user = await new User({
        name: name || lower.split("@")[0],
        email: lower,
        googleId,
        profileImage: picture || "",
        authProvider: "google",
      }).save();
    }

    const { user: safeUser, accessToken } = await loginUser(res, user);
    res.json({ success: true, user: safeUser, accessToken });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Refresh token

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    console.log(" Incoming refresh request");
    console.log(" Cookie refreshToken =", token);

    if (!token) {
      console.warn(" No refresh token cookie sent");
      return res
        .status(401)
        .json({ success: false, message: "No refresh token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      console.log("JWT verified. Payload =", decoded);
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      console.warn(" No user found for id:", decoded.id);
      return res.status(403).json({ success: false, message: "User not found" });
    }

    console.log("User found:", user.email);
    console.log("User.refreshTokens (count):", user.refreshTokens.length);

    if (!user.refreshTokens.includes(token)) {
      console.warn("Refresh token not found in DB list");
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    const { accessToken, refreshToken: newRefresh } = generateTokens(user);

    // replace old token

    user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
    user.refreshTokens.push(newRefresh);
    await user.save();
    console.log("✅ Refresh token rotated. New count:", user.refreshTokens.length);

    setAuthCookies(res, accessToken, newRefresh);

    return res.json({
      success: true,
      message: "Token refreshed",
      user: publicUser(user),
      accessToken,
    });
  } catch (err) {
    console.error("🔥 Refresh Token Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshTokens"
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, user: publicUser(user) });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      try {
        const { id } = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(id);
        if (user) {
          user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
          await user.save();
        }
      } catch {
      
      }
    }

    clearAuthCookies(res);
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  refreshToken,
  getProfile,
  logout,
};
