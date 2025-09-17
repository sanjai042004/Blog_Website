// utils/auth.js
const jwt = require("jsonwebtoken");

const buildCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
});

const createTokens = (user) => ({
  accessToken: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "12h" }),
  refreshToken: jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" }),
});

const attachTokens = (res, tokens) => {
  const opts = buildCookieOptions();
  res.cookie("accessToken", tokens.accessToken, { ...opts, maxAge: 3600000 });
  res.cookie("refreshToken", tokens.refreshToken, { ...opts, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

const clearCookies = (res) => {
  const opts = buildCookieOptions();
  res.clearCookie("accessToken", opts);
  res.clearCookie("refreshToken", opts);
};

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  bio: user.bio || "",
  profileImage: user.profileImage || "",
  authProvider: user.authProvider,
});


module.exports = { createTokens, attachTokens, clearCookies, publicUser };
