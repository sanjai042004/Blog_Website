const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
}, { timestamps: true });

const RegisterModel = mongoose.model("User", userSchema);

module.exports = RegisterModel;
