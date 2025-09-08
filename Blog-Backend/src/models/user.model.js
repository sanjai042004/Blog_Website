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
     default: "/uploads/default-avatar.png",
    },
    bio: { type: String, trim: true, default: "" },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      required: true,
      default: "local",
    },
    refreshTokens: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 50,
        message: "Exceeded maximum number of refresh tokens (50)",
      },
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
