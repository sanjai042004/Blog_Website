const User = require("../models/user.model");
const Post = require("../models/post.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helpers
const buildCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
});

const createTokens = (user) => {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET)
    throw new Error("JWT env vars missing");

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

const attachTokensToResponse = (res, user, tokens) => {
  const opts = buildCookieOptions();
  res.cookie("accessToken", tokens.accessToken, { ...opts, maxAge: 3600000 });
  res.cookie("refreshToken", tokens.refreshToken, {
    ...opts,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookies = (res) => {
  const opts = buildCookieOptions();
  res.clearCookie("accessToken", opts);
  res.clearCookie("refreshToken", opts);
};

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar:
    user.profileImage?.trim() ||
    (user.name ? user.name.charAt(0).toUpperCase() : "U"),
  profileImage: user.profileImage || "",
  authProvider: user.authProvider,
});

// Handles login for both local and Google
const handleLogin = async (res, user) => {
  const tokens = createTokens(user);
  user.refreshTokens.push(tokens.refreshToken);
  await user.save();
  attachTokensToResponse(res, user, tokens);
  return { user: publicUser(user), accessToken: tokens.accessToken };
};

// Controllers

// Register
const register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  if (password.length < 8)
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });

  const lowerEmail = email.toLowerCase();
  if (await User.findOne({ email: lowerEmail }))
    return res
      .status(400)
      .json({ success: false, message: "Email already in use" });

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name || lowerEmail.split("@")[0],
    email: lowerEmail,
    password: hashedPassword,
    authProvider: "local",
  });

  const { user: safeUser, accessToken } = await handleLogin(res, user);
  res.status(201).json({ success: true, user: safeUser, accessToken });
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
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

  const { user: safeUser, accessToken } = await handleLogin(res, user);
  res.json({ success: true, user: safeUser, accessToken });
};

// Google Login
const googleLogin = async (req, res) => {
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

  const lowerEmail = email.toLowerCase();
  let user = await User.findOne({ email: lowerEmail });

  if (user) {
    user.googleId ||= googleId;
    user.name ||= name;
    if (!user.profileImage || user.profileImage !== picture)
      user.profileImage = picture || user.profileImage;
    if (user.authProvider !== "local") user.authProvider = "google";
    await user.save();
  } else {
    user = await User.create({
      name: name || lowerEmail.split("@")[0],
      email: lowerEmail,
      googleId,
      profileImage: picture || "",
      authProvider: "google",
    });
  }

  const { user: safeUser, accessToken } = await handleLogin(res, user);
  res.json({ success: true, user: safeUser, accessToken });
};

// Refresh Token
const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "No refresh token" });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.refreshTokens.includes(token))
    return res
      .status(403)
      .json({ success: false, message: "Invalid refresh token" });

  const { accessToken, refreshToken: newRefresh } = createTokens(user);
  user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
  user.refreshTokens.push(newRefresh);
  await user.save();

  attachTokensToResponse(res, user, { accessToken, refreshToken: newRefresh });
  res.json({
    success: true,
    message: "Token refreshed",
    user: publicUser(user),
    accessToken,
  });
};

// Logout
const logout = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    try {
      const { id } = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(id);
      if (user)
        user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
      await user?.save();
    } catch {}
  }
  clearAuthCookies(res);
  res.json({ success: true, message: "Logged out successfully" });
};

// Get Profile
const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "-password -refreshTokens"
  );
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, user: publicUser(user) });
};

// Get Author with Posts
const getAuthorWithPosts = async (req, res) => {
  const authorId = req.params.authorId;
  const user = await User.findById(authorId).select("-password -refreshTokens");
  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "Author not found" });

  const posts = await Post.find({ author: authorId })
    .sort({ createdAt: -1 })
    .populate("author", "name profileImage bio");

  res.json({ success: true, user, posts });
};

module.exports = {
  register,
  login,
  googleLogin,
  refreshToken,
  getProfile,
  logout,
  getAuthorWithPosts,
};
