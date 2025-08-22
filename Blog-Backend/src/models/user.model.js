const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: { type: String, default: null },
    profileImage: {
      type: String,
      default: "https://ui-avatars.com/api/?name=User&background=random",
    },

    googleId: { type: String, default: null },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    refreshTokens: {
      type: [String],
      default: [],

      validate: {
        validator: function (arr) {
          return arr.length <= 5;
        },
        message: "Exceeded maximum active sessions (5)",
      },
    },
  },
  { timestamps: true }
);


const User = mongoose.model("User", userSchema);
module.exports = User;
