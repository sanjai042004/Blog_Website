const User = require("../models/user.model");
const Follow = require("../models/follow.model");

const followUser = async (req, res) => {
  try {
    const followerId = req.user._id;
    const followingId = req.params.id;

    if (followerId.toString() === followingId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const targetUser = await User.findById(followingId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Follow.create({
      follower: followerId,
      following: followingId,
    });

    const followersCount = await Follow.countDocuments({
      following: followingId,
    });

    res.status(200).json({
      success: true,
      message: "Followed successfully",
      isFollowed: true,
      followersCount,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Already following",
      });
    }

    console.error("Follow Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const unFollowUser = async (req, res) => {
  try {
    const followerId = req.user._id;
    const followingId = req.params.id;

    await Follow.findOneAndDelete({
      follower: followerId,
      following: followingId,
    });

    const followersCount = await Follow.countDocuments({
      following: followingId,
    });

    res.status(200).json({
      success: true,
      message: "Unfollowed successfully",
      isFollowed: false,
      followersCount,
    });
  } catch (err) {
    console.error("Unfollow Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getFollowers = async (req, res) => {
  try {
    const userId = req.params.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const followers = await Follow.find({ following: userId })
      .populate("follower", "name profileImage")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Follow.countDocuments({ following: userId });

    res.status(200).json({
      success: true,
      followers: followers.map(f => f.follower),
      total,
    });
  } catch (err) {
    console.error("GetFollowers Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getFollowing = async (req, res) => {
  try {
    const userId = req.params.id;

    const following = await Follow.find({ follower: userId })
      .populate("following", "name profileImage");

    res.status(200).json({
      success: true,
      following: following.map(f => f.following),
    });
  } catch (err) {
    console.error("GetFollowing Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const followStatus = async (req, res) => {
  try {
    const followerId = req.user._id;
    const followingId = req.params.id;

    const existing = await Follow.findOne({
      follower: followerId,
      following: followingId,
    });

    const followersCount = await Follow.countDocuments({
      following: followingId,
    });

    res.status(200).json({
      success: true,
      isFollowed: !!existing,
      followersCount,
    });
  } catch (err) {
    console.error("FollowStatus Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  followUser,
  unFollowUser,
  getFollowers,
  getFollowing,
  followStatus,
};