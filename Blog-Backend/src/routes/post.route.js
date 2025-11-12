const express = require("express");
const router = express.Router();
const upload = require("../config/cloudinary");
const {getPosts,getPostById,createPost,updatePost,deletePost,addComment,deleteComment,clapPost,clapComment,} = require("../controllers/post.controller");
const { authenticateUser } = require("../middlewares/authenticateUser");

// Public
router.get("/", getPosts);
router.get("/:id", getPostById);

// Authenticated routes
router.post("/", authenticateUser, upload.array("images"), createPost);
router.put("/:id", authenticateUser, upload.array("images"), updatePost);
router.delete("/:id", authenticateUser, deletePost);

// Comments
router.post("/:id/comments", authenticateUser, addComment);
router.delete("/:postId/comments/:commentId", authenticateUser, deleteComment); // Optional: delete comment
router.post("/:postId/comments/:commentId/clap", authenticateUser, clapComment);

// Claps
router.post("/:id/clap", authenticateUser, clapPost);

module.exports = router;
