const express = require("express");
const { getAuthorWithPosts } = require("../controllers/user.controllers");
const router = express.Router();

router.get("/author/:authorId", getAuthorWithPosts);

module.exports = router;
