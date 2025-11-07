const User = require("../models/user.model");
const Post = require("../models/post.model");
const { clearCookies, publicUser } = require("../utils/auth");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshTokens"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password ");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const { name, bio } = req.body;

    if (name) user.name = name;
    if (bio) user.bio = bio;

    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ success: true, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAuthorWithPosts = async (req, res) => {
  try {
    const { authorId } = req.params;

    if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid author ID" });
    }

    const user = await User.findById(authorId)
      .select("-password -refreshTokens")
      .populate("followers", "name profileImage")
      .populate("following", "name profileImage");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    }

    const posts = await Post.find({ author: user._id })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });

    res.json({ success: true, user, posts });
  } catch (err) {
    console.error("getAuthorWithPosts error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isDeactivated = true;
    await user.save();

    clearCookies(res);
    res.json({ success: true, message: "Account deactivated successfully" });
  } catch (err) {
    console.error("Deactivate error:", err);
    res.status(500).json({ message: "Error deactivating account" });
  }
};

// Reactivate Account
const reactivateAccount = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isDeactivated)
      return res
        .status(400)
        .json({ message: "Account not deactivated or not found" });

    user.isDeactivated = false;
    await user.save();

    res.json({ success: true, message: "Account reactivated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error reactivating account" });
  }
};

//  Permanently Delete Account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await Post.deleteMany({ author: userId });
    await User.findByIdAndDelete(userId);
    clearCookies(res);
    res.json({ success: true, message: "Account permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting account" });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!(await comparePassword(oldPassword, user.password)))
      return res.status(400).json({ message: "Incorrect old password" });

    user.password = await hashPassword(newPassword);
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error changing password" });
  }
};

module.exports = {
  changePassword,
  reactivateAccount,
  deactivateAccount,
  deleteAccount,
  getAuthorWithPosts,
  getProfile,
  updateProfile,
};
