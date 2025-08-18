const express = require("express");
const {  googleLogin } = require("../controllers/auth.controller");
const {register,login}=require("../controllers/register.controller")

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);

module.exports = router;