const express = require("express");
const router = express.Router();
const { googleLogin } = require("../controllers/auth.controller");
const { register, login, logout } = require("../controllers/register.controller");

router.post("/google", googleLogin);
router.post("/register", register);
router.post("/login", login);   // 👈 fix
router.post("/logout", logout); // 👈 fix

module.exports = router;
