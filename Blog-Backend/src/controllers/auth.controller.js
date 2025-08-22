const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//  TOKEN HELPERS 
const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res.cookie("accessToken", accessToken, { ...options, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, {
    ...options,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const loginUser = async (res, user) => {
  const { accessToken, refreshToken } = generateTokens(user);

  // store refresh token in DB
  user.refreshTokens.push(refreshToken);
  await user.save();

  // set cookies
  setAuthCookies(res, accessToken, refreshToken);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
    authProvider: user.authProvider,
  };
};

//  REGISTER 
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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name: name || email.split("@")[0],
      email,
      password: hashedPassword,
      authProvider: "local",
    });

    const savedUser = await newUser.save();
    const userData = await loginUser(res, savedUser);

    res.status(201).json({ success: true, user: userData });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  LOGIN 
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    email = email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (user.authProvider !== "local") {
      return res.status(400).json({
        success: false,
        message: `Please login with ${user.authProvider}`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const userData = await loginUser(res, user);
    res.status(200).json({ success: true, user: userData });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  GOOGLE LOGIN 
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Google token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) user.googleId = googleId;
      if (!user.profileImage || user.profileImage !== picture) {
        user.profileImage = picture;
      }
      user.authProvider = "google";
      await user.save();
    } else {
      user = new User({
        name,
        email,
        googleId,
        profileImage: picture,
        authProvider: "google",
      });
      await user.save();
    }

    const userData = await loginUser(res, user);
    res.status(200).json({ success: true, user: userData });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  REFRESH TOKEN 
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies["refreshToken"];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshTokens.includes(token)) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    const { accessToken, refreshToken: newRefresh } = generateTokens(user);

    // Replace old refresh token with new one
    const updatedTokens = user.refreshTokens.filter((t) => t !== token);
    updatedTokens.push(newRefresh);

    await User.findByIdAndUpdate(user._id, { refreshTokens: updatedTokens });

    setAuthCookies(res, accessToken, newRefresh);

    res.status(200).json({ success: true, message: "Token refreshed" });
  } catch (err) {
    console.error("Refresh Token Error:", err);
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
};

//  GET PROFILE 
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshTokens"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        authProvider: user.authProvider,
      },
    });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  LOGOUT 
const logout = async (req, res) => {
  try {
    const token = req.cookies["refreshToken"];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
        await user.save();
      }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
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
