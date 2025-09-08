const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.route");
const postRoutes = require("./post.route");
const userRoutes = require("./user.route"); 
// 
router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/users", userRoutes); 

module.exports = router;
