const express = require("express");
const router = express.Router();
const {register,login,googleLogin,refreshToken,getProfile,logout,} = require("../controllers/auth.controller");
const { authenticateUser }=require("../middlewares/authenticateUser")


router.post("/register", register);

router.post("/login", login);

router.post("/google", googleLogin);

router.post("/refresh", refreshToken);

// router.get("/author/:authorId", getAuthorWithPosts);

router.get("/profile", authenticateUser, getProfile);

router.post("/logout", logout);

module.exports = router;
