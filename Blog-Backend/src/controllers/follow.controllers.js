const User = require("../models/user.model");

// Follow a user
const followUser = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const targetUserId = req.params.id;

    if (userId === targetUserId) {
      return res.status(400).json({ success: false, message: "You cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.following.includes(targetUserId)) {
      return res.status(400).json({ success: false, message: "You are already following this user" });
    }

    user.following.push(targetUserId);
    targetUser.followers.push(userId);

    await user.save();
    await targetUser.save();

    res.status(200).json({ success: true, message: "Followed successfully" });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Unfollow a user
const unFollowUser = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const targetUserId = req.params.id;

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.following.includes(targetUserId)) {
      return res.status(400).json({ success: false, message: "You are not following this user" });
    }

    user.following = user.following.filter((id) => id.toString() !== targetUserId);
    targetUser.followers = targetUser.followers.filter((id) => id.toString() !== userId);

    await user.save();
    await targetUser.save();

    res.status(200).json({ success: true, message: "Unfollowed successfully" });
  } catch (error) {
    console.error("Unfollow error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get followers of a user
const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("followers", "name profileImage");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, followers: user.followers });
  } catch (error) {
    console.error("Get followers error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get following of a user
const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("following", "name profileImage");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, following: user.following });
  } catch (error) {
    console.error("Get following error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { followUser, unFollowUser, getFollowers, getFollowing };
