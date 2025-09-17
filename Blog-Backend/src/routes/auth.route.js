const express = require("express");
const router = express.Router();
const upload = require("../../uploads/upload");
const {register,login,googleLogin,refreshToken,getProfile,logout,updateProfile, } = require("../controllers/auth.controller");

const { authenticateUser } = require("../middlewares/authenticateUser");


router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/refresh", refreshToken);
router.post("/logout", logout);


router.get("/profile", authenticateUser, getProfile);
router.put("/profile", authenticateUser, upload.single("profileImage"), updateProfile);


module.exports = router;
