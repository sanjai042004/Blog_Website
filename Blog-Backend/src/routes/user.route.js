const express = require("express");
const router = express.Router();
const { getAuthorWithPosts } = require("../controllers/auth.controller");

// Route to fetch author + their posts
router.get("/author/:authorId", getAuthorWithPosts);

module.exports = router;
