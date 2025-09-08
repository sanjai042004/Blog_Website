const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.route");
const postRoutes = require("./post.route");
// const authorRoutes = require("./author.route");

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
// router.use("/authors", authorRoutes);

module.exports = router;
