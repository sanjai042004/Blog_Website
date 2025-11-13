const User = require("../models/user.model");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


//Helper Send OTP email
const sendOtpEmail = async (email, subject, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: `
      <h2>${subject}</h2>
      <p>Your OTP for password reset is:</p>
      <h3>${otp}</h3>
      <p>This OTP will expire in 10 minutes.</p>
    `,
  });
};

//Forgot Password Generate OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });

    if (!user)
      return res.json({
        message: "If this email exists, an OTP has been sent.",
      });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    await sendOtpEmail(email, "Your OTP for Password Reset", otp);

    res.json({ message: "OTP sent successfully to your email." });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    res.status(500).json({ message: "Error sending OTP. Please try again." });
  }
};

//Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP." });

    res.json({ message: "OTP verified successfully!" });
  } catch (error) {
    console.error("Verify OTP Error:", error.message);
    res.status(500).json({ message: "Server error verifying OTP." });
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.json({
        message: "If this email exists, a new OTP has been sent.",
      });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOtpEmail(email, "Resend OTP for Password Reset", otp);

    res.json({ message: "New OTP sent successfully to your email." });
  } catch (error) {
    console.error("Resend OTP Error:", error.message);
    res.status(500).json({ message: "Error resending OTP. Please try again." });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "Missing fields" });

    if (newPassword.length < 8)
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP." });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    res
      .status(500)
      .json({ message: "Server error while resetting password." });
  }
};

module.exports = {
  forgotPassword,
  verifyOtp,
  resendOtp,
  resetPassword,
};
