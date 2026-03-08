const mongoose = require("mongoose");
const User = require("../models/user.model");
const Follow = require("../models/follow.model");


// FOLLOW USER
const followUser = async (req, res) => {
  try {
    const followerId = req.user._id;
    const followingId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(followingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

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

    const existing = await Follow.findOne({
      follower: followerId,
      following: followingId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already following",
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

  } catch (error) {
    console.error("Follow Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



// UNFOLLOW USER
const unFollowUser = async (req, res) => {
  try {
    const followerId = req.user._id;
    const followingId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(followingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

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

  } catch (error) {
    console.error("Unfollow Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



// GET FOLLOWERS
const getFollowers = async (req, res) => {
  try {
    const userId = req.params.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    const followers = await Follow.find({ following: userId })
      .populate("follower", "name profileImage")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Follow.countDocuments({
      following: userId,
    });

    res.status(200).json({
      success: true,
      followers: followers.map((f) => f.follower),
      total,
      page,
      pages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error("GetFollowers Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



// GET FOLLOWING
const getFollowing = async (req, res) => {
  try {
    const userId = req.params.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    const following = await Follow.find({ follower: userId })
      .populate("following", "name profileImage")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Follow.countDocuments({
      follower: userId,
    });

    res.status(200).json({
      success: true,
      following: following.map((f) => f.following),
      total,
      page,
      pages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error("GetFollowing Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



// FOLLOW STATUS
const followStatus = async (req, res) => {
  try {
    const followerId = req.user._id;
    const followingId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(followingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

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

  } catch (error) {
    console.error("FollowStatus Error:", error);

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