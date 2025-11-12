const express = require("express");
const router = express.Router();
const upload = require("../config/cloudinary");
const {register,login,googleLogin,refreshToken,logout,} = require("../controllers/auth.controller");
const {forgotPassword,resetPassword,verifyOtp,resendOtp,} = require("../controllers/otp.controllers");
const {getProfile,updateProfile,deactivateAccount,reactivateAccount,deleteAccount,changePassword,} = require("../controllers/user.controllers");
const { authenticateUser } = require("../middlewares/authenticateUser");

// Auth
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.post("/google-login", googleLogin);

// OTP
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// User
router.get("/profile", authenticateUser, getProfile);
router.put("/profile", authenticateUser, upload.single("profileImage"), updateProfile);
router.put("/deactivate", authenticateUser, deactivateAccount);
router.post("/reactivate", reactivateAccount);
router.delete("/delete", authenticateUser, deleteAccount);
router.put("/change-password", authenticateUser, changePassword);

module.exports = router;
