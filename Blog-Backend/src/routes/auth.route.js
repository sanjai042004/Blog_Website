const express = require("express");
const router = express.Router();
const {register,login,googleLogin,refreshToken,logout,} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.post("/google-login", googleLogin);

module.exports = router;
