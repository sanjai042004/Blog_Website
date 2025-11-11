const express = require("express");
const {followUser,unFollowUser,getFollowers,getFollowing,followStatus,} = require("../controllers/follow.controllers");
const { authenticateUser } = require("../middlewares/authenticateUser");

const router = express.Router();

router.post("/follow/:id", authenticateUser, followUser);
router.post("/unfollow/:id", authenticateUser, unFollowUser);
router.get("/:id/followers", getFollowers);
router.get("/:id/following", getFollowing);
router.get("/:id/follow-status", authenticateUser, followStatus);

module.exports = router;
