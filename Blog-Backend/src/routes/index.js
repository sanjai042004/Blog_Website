const express = require("express");
const router = express.Router();
const { googleLogin } = require("../controllers/auth.controller");
const {register}=require("../controllers/register.controller")

router.post("/google", googleLogin);
router.post("/register", register);

module.exports = router;
