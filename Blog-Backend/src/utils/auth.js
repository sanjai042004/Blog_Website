const jwt = require("jsonwebtoken");

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/",
};

//  CREATE TOKENS
const createTokens = (user) => {
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

//  ATTACH COOKIE (REFRESH ONLY)

const attachTokens = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

//  CLEAR COOKIE
const clearCookies = (res) => {
  res.clearCookie("refreshToken", cookieOptions);
};

//  PUBLIC USER
const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  bio: user.bio || "",
  profileImage: user.profileImage || "",
  authProvider: user.authProvider,
  role: user.role,
});

module.exports = {
  createTokens,
  attachTokens,
  clearCookies,
  publicUser,
};
