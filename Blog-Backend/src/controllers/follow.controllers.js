const User = require("../models/user.model");

// Follow a user
const followUser = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const targetUserId = req.params.id;

    if (userId === targetUserId)
      return res.status(400).json({ success: false, message: "You cannot follow yourself" });

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ success: false, message: "User not found" });
    if (user.following.includes(targetUserId))
      return res.status(400).json({ success: false, message: "Already following" });

    user.following.push(targetUserId);
    targetUser.followers.push(userId);

    await user.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: "Followed successfully",
      isFollowed: true,
      followersCount: targetUser.followers.length,
    });
  } catch (err) {
    console.error(err);
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
    if (!targetUser) return res.status(404).json({ success: false, message: "User not found" });

    user.following = user.following.filter((id) => id.toString() !== targetUserId);
    targetUser.followers = targetUser.followers.filter((id) => id.toString() !== userId);

    await user.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: "Unfollowed successfully",
      isFollowed: false,
      followersCount: targetUser.followers.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get followers
const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("followers", "name profileImage");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, followers: user.followers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get following
const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("following", "name profileImage");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, following: user.following });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Follow status 
const followStatus = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const targetUserId = req.params.id;

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ success: false, message: "User not found" });

    const isFollowed = targetUser.followers.includes(userId);
    res.status(200).json({ success: true, isFollowed, followersCount: targetUser.followers.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { followUser, unFollowUser, getFollowers, getFollowing, followStatus };
