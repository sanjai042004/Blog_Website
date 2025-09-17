const express = require("express");
const router = express.Router();
const { getAuthorWithPosts } = require("../controllers/auth.controller");

router.get("/author/:authorId", getAuthorWithPosts);

module.exports = router;
