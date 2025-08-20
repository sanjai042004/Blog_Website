const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // ✅ Check from cookies or Bearer token
    const token =
      req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not set in environment variables");
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info for routes
    req.user = { id: decoded.id, email: decoded.email, provider: decoded.provider };

    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
