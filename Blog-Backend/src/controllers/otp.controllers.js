const User = require("../models/user.model");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// otp helper
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const hashOTP = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

// email structure
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

// Forget password 
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: true,
        message: "If this email exists, an OTP has been sent.",
      });
    }

    if (user.authProvider === "google") {
      return res.status(400).json({
        success: false,
        message: "Google users cannot reset password",
      });
    }

    const otp = generateOTP();

    user.resetPasswordOTP = hashOTP(otp);
    user.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000; 

    await user.save();

    await sendOtpEmail(email, "Your OTP for Password Reset", otp);

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error sending OTP",
    });
  }
};

// verify otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email }).select(
      "+resetPasswordOTP +resetPasswordOTPExpire"
    );

    if (!user || !user.resetPasswordOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    if (user.resetPasswordOTPExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (hashOTP(otp) !== user.resetPasswordOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    return res.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Server error verifying OTP",
    });
  }
};

// resend otp
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: true,
        message: "If this email exists, a new OTP has been sent.",
      });
    }

    const otp = generateOTP();

    user.resetPasswordOTP = hashOTP(otp);
    user.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendOtpEmail(email, "Resend OTP for Password Reset", otp);

    return res.json({
      success: true,
      message: "New OTP sent successfully",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Error resending OTP",
    });
  }
};

// reset password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const user = await User.findOne({ email }).select(
      "+resetPasswordOTP +resetPasswordOTPExpire"
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    if (user.resetPasswordOTPExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (hashOTP(otp) !== user.resetPasswordOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Server error resetting password",
    });
  }
};

// exports
module.exports = {
  forgotPassword,
  verifyOtp,
  resendOtp,
  resetPassword,
};
