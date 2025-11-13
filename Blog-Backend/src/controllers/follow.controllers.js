const User = require("../models/user.model");

// Follow a user
const followUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetId = req.params.id;

    if (userId.toString() === targetId)
      return res
        .status(400)
        .json({ success: false, message: "You cannot follow yourself" });

    const [user, target] = await Promise.all([
      User.findById(userId),
      User.findById(targetId),
    ]);

    if (!target)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    if (user.following.includes(targetId))
      return res
        .status(400)
        .json({ success: false, message: "Already following" });

    user.following.push(targetId);
    target.followers.push(userId);

    await Promise.all([user.save(), target.save()]);

    res.status(200).json({
      success: true,
      message: "Followed successfully",
      isFollowed: true,
      followersCount: target.followers.length,
    });
  } catch (err) {
    console.error("Follow Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Unfollow a user
const unFollowUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetId = req.params.id;

    const [user, target] = await Promise.all([
      User.findById(userId),
      User.findById(targetId),
    ]);

    if (!target)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.following = user.following.filter((id) => id.toString() !== targetId);
    target.followers = target.followers.filter(
      (id) => id.toString() !== userId.toString()
    );

    await Promise.all([user.save(), target.save()]);

    res.status(200).json({
      success: true,
      message: "Unfollowed successfully",
      isFollowed: false,
      followersCount: target.followers.length,
    });
  } catch (err) {
    console.error("Unfollow Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get followers list
const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers",
      "name profileImage"
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, followers: user.followers });
  } catch (err) {
    console.error("GetFollowers Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  Get following list
const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "following",
      "name profileImage"
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, following: user.following });
  } catch (err) {
    console.error("GetFollowing Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  Check follow status
const followStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetId = req.params.id;

    const target = await User.findById(targetId);
    if (!target)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isFollowed = target.followers.includes(userId);
    res.status(200).json({
      success: true,
      isFollowed,
      followersCount: target.followers.length,
    });
  } catch (err) {
    console.error("FollowStatus Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  followUser,
  unFollowUser,
  getFollowers,
  getFollowing,
  followStatus,
};
