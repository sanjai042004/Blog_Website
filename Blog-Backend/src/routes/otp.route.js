const express = require("express");
const { forgotPassword, resetPassword, verifyOtp, resendOtp } = require("../controllers/otp.controllers");
const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

module.exports = router;
