const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Authenticate with JWT (access token)
const authenticateUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers["authorization"]?.startsWith("Bearer ")
        ? req.headers["authorization"].split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not set in environment variables");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// Role-based authorization
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You don’t have permission",
      });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };
