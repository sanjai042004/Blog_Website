
const express = require("express");
const { googleLogin } = require("../controllers/googleAuth.controller");
const { register, login, logout } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);


router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});


router.post("/logout", logout);

module.exports = router;
