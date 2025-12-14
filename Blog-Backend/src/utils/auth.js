const jwt = require("jsonwebtoken");

const cookieOptions = {
  httpOnly: true, 
  secure: true,
  sameSite: "None",
  path: "/",
};

const createTokens = (user) => {
  return {
    accessToken: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" }),
    refreshToken: jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" }),
  };
};

const attachTokens = (res, tokens) => {
  res.cookie("accessToken", tokens.accessToken, { ...cookieOptions, maxAge: 60 * 60 * 1000 }); 
  res.cookie("refreshToken", tokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }); 
};

const clearCookies = (res) => {
  res.clearCookie("accessToken", {
    ...cookieOptions,
    maxAge: 0,
  });
  res.clearCookie("refreshToken", {
    ...cookieOptions,
    maxAge: 0,
  });
};


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
