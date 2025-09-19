const express = require("express");
const { followUser, unFollowUser, getFollowers, getFollowing } = require("../controllers/follow.controllers");
const { authenticateUser } = require("../middlewares/authenticateUser");

const router = express.Router();

router.post("/follow/:id", authenticateUser, followUser);
router.post("/unfollow/:id", authenticateUser, unFollowUser);
router.get("/:id/followers", getFollowers);
router.get("/:id/following", getFollowing);

module.exports = router;
