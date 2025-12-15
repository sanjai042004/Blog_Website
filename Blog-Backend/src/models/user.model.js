const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    googleId: {
      type: String,
      index: true,
      sparse: true,
    },

    profileImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    authProvider: {
      type: String,
      enum: ["local", "google"],
      required: true,
      default: "local",
    },
    refreshTokens: {
      type: [String],
      default: [],
    },
    resetPasswordOTP: String,
    resetPasswordOTPExpire: Date,
    isDeactivated: { type: Boolean, default: false },

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
