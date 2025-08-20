const express = require("express");
const router = express.Router();
const { googleLogin } = require("../controllers/googleAuth.controller");
const { register, login, logout } = require("../controllers/auth.controller");

router.post("/google", googleLogin);
router.post("/register", register);
router.post("/login", login);   
router.post("/logout", logout); 

module.exports = router;
