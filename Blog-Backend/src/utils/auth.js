const jwt = require("jsonwebtoken");

//Default cookie options
const cookieOptions = {
  httpOnly: true, 
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

//Generate access and refresh tokens
const createTokens = (user) => {
  return {
    accessToken: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" }),
    refreshToken: jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" }),
  };
};

//Set tokens in cookies
const attachTokens = (res, tokens) => {
  res.cookie("accessToken", tokens.accessToken, { ...cookieOptions, maxAge: 60 * 60 * 1000 }); // 1 hour
  res.cookie("refreshToken", tokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
};

//Remove tokens from cookies
const clearCookies = (res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};

//Safe user data to send to client
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
