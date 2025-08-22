const express = require("express");
const router = express.Router();
const {register,login,googleLogin,refreshToken,logout,getProfile} = require("../controllers/auth.controller");
const { authenticateUser } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin); 
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/profile", authenticateUser, getProfile);
module.exports = router;
