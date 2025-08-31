const express = require("express");
const router = express.Router();
const path = require("path");
const upload = require("../../uploads/upload");
const {getPosts,getPostById,createPost,updatePost,deletePost,addComment,clapPost,} = require("../controllers/post.controller");
const { authenticateUser } = require("../middlewares/authenticateUser");

router.get("/", getPosts);

router.get("/:id", getPostById);

router.post("/", authenticateUser, upload.array("images"), createPost);

router.delete("/:id", authenticateUser, deletePost);

router.post("/:id/comments", authenticateUser, addComment);

router.post("/:id/clap", authenticateUser, clapPost);

module.exports = router;
