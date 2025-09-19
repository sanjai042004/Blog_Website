const User = require("../models/user.model");
const Post = require("../models/post.model");
const upload = require("../../uploads/upload");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { createTokens, attachTokens, clearCookies, publicUser } = require("../utils/auth");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email & password required" });
    if (password.length < 8) return res.status(400).json({ success: false, message: "Password must be 8+ chars" });

    const lowerEmail = email.toLowerCase();
    if (await User.findOne({ email: lowerEmail }))
      return res.status(400).json({ success: false, message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name || lowerEmail.split("@")[0],
      email: lowerEmail,
      password: hashedPassword,
      authProvider: "local",
    });

    const tokens = createTokens(user);
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    attachTokens(res, tokens);
    res.status(201).json({ success: true, user: publicUser(user) });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const tokens = createTokens(user);
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    attachTokens(res, tokens);
    res.json({ success: true, user: publicUser(user) });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Google Login

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // 1️⃣ Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // 2️⃣ Extract Google payload
    const { email, name, picture, sub: googleId } = ticket.getPayload();

    // 3️⃣ Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with Google profile image
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: "google",
        profileImage: picture || "", // Medium-style
      });
    } else if (!user.profileImage && picture) {
      // Update profile image if not set
      user.profileImage = picture;
      await user.save();
    }

    // 4️⃣ Generate JWT tokens
    const tokens = createTokens(user);
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    // 5️⃣ Attach tokens to cookies
    attachTokens(res, tokens);

    // 6️⃣ Return public user info
    res.json({ success: true, user: publicUser(user) });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Refresh
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(token))
      return res.status(403).json({ success: false, message: "Invalid refresh token" });

    const newTokens = createTokens(user);
    user.refreshTokens = user.refreshTokens.filter((t) => t !== token).concat(newTokens.refreshToken);
    await user.save();

    attachTokens(res, newTokens);
    res.json({ success: true, user: publicUser(user) });
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
        await user.save();
      }
    }
  } finally {
    clearCookies(res);
    res.json({ success: true, message: "Logged out" });
  }
};

// Profile
const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -refreshTokens");
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, user: publicUser(user) });
};

// Author + Posts
const getAuthorWithPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.authorId)
      .select("-password -refreshTokens")
      .populate("followers", "name profileImage")
      .populate("following", "name profileImage");

    if (!user) {
      return res.status(404).json({ success: false, message: "Author not found" });
    }

    const posts = await Post.find({ author: user._id })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      user, 
      posts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Update Profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password ");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const { name, bio } = req.body;
    if (name) user.name = name;
    if (bio) user.bio = bio;

  
    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ success: true, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports = { 
  register, 
  login,
  googleLogin, 
  refreshToken, 
  logout, 
  getProfile, 
  getAuthorWithPosts,
  updateProfile 
};
