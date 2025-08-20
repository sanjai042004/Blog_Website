const express = require("express");
const authRoutes = require("./auth.route");
const postRoutes = require("./post.route");

const router = express.Router();

router.use("/auth", authRoutes);  
router.use("/posts", postRoutes);

module.exports = router;
