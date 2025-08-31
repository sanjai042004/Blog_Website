const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.route");
const postRoutes = require("./post.route");
const adminRoutes = require("./admin.route");

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
// router.use("/admin", adminRoutes);

module.exports = router;
