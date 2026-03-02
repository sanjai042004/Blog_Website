const express = require("express");
const {
  followUser,
  unFollowUser,
  getFollowers,
  getFollowing,
  followStatus,
} = require("../controllers/follow.controllers");
const { authenticateUser } = require("../middlewares/authenticateUser");

const router = express.Router();

router.post("/:id", authenticateUser, followUser);
router.delete("/:id", authenticateUser, unFollowUser);

router.get("/:id/followers", getFollowers);
router.get("/:id/following", getFollowing);
router.get("/:id/follow-status", authenticateUser, followStatus);

module.exports = router;