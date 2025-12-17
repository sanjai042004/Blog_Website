const User = require("../models/user.model");
const Post = require("../models/post.model");
const { clearCookies, publicUser } = require("../utils/auth");
const bcrypt = require("bcrypt");

const hashPassword = async (plain) => await bcrypt.hash(plain, 10);
const comparePassword = async (plain, hashed) => await bcrypt.compare(plain, hashed);

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -refreshTokens");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user: publicUser(user) });
  } catch {
    res.status(500).json({ success: false, message: "Server error fetching profile" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const { name, bio } = req.body;
    if (name) user.name = name;
    if (bio) user.bio = bio;

    if (req.file) {
      user.profileImage = req.file.path;
      user.profileImagePublicId = req.file.filename || null;
    }

    await user.save();
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: publicUser(user),
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error updating profile" });
  }
};

const getAuthorWithPosts = async (req, res) => {
  const { authorId } = req.params;
  if (!authorId)
    return res.status(400).json({ success: false, message: "Invalid author ID" });

  try {
    const [user, posts] = await Promise.all([
      User.findById(authorId)
        .select("-password -refreshTokens")
        .populate("followers", "name profileImage")
        .populate("following", "name profileImage"),
      Post.find({ author: authorId })
        .populate("author", "name profileImage")
        .sort({ createdAt: -1 }),
    ]);

    if (!user)
      return res.status(404).json({ success: false, message: "Author not found" });

    res.json({ success: true, user, posts });
  } catch {
    res.status(500).json({ success: false, message: "Server error fetching author" });
  }
};

const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    user.isDeactivated = true;
    await user.save();
    clearCookies(res);
    res.json({ success: true, message: "Account deactivated successfully" });
  } catch {
    res.status(500).json({ success: false, message: "Error deactivating account" });
  }
};

const reactivateAccount = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isDeactivated)
      return res
        .status(400)
        .json({ success: false, message: "Account not deactivated or not found" });

    user.isDeactivated = false;
    await user.save();

    res.json({ success: true, message: "Account reactivated successfully" });
  } catch {
    res.status(500).json({ success: false, message: "Error reactivating account" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await Promise.all([
      Post.deleteMany({ author: userId }),
      User.findByIdAndDelete(userId),
    ]);

    clearCookies(res);
    res.json({ success: true, message: "Account permanently deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Error deleting account" });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return res
      .status(400)
      .json({ success: false, message: "Both old and new passwords required" });

  if (newPassword.length < 8)
    return res.status(400).json({
      success: false,
      message: "New password must be at least 8 characters long",
    });

  try {
    const user = await User.findById(req.user.id).select("+password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect old password" });

    user.password = await hashPassword(newPassword);
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch {
    res.status(500).json({ success: false, message: "Error changing password" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAuthorWithPosts,
  deactivateAccount,
  reactivateAccount,
  deleteAccount,
  changePassword,
};
