const express = require("express");
const { googleLogin, getProfile, register, login, logout } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Normal auth
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Google auth
router.post("/google", googleLogin);

// Protected
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
