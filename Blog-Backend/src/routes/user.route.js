const express = require("express");
const { getAuthorWithPosts, getProfile, updateProfile, deactivateAccount, reactivateAccount, changePassword, deleteAccount } = require("../controllers/user.controllers");
const router = express.Router();
const upload = require("../config/cloudinary");
const { authenticateUser } = require("../middlewares/authenticateUser");


router.get("/author/:authorId", getAuthorWithPosts);
router.get("/profile", authenticateUser, getProfile);
router.put("/update", authenticateUser, upload.single("profileImage"), updateProfile);
router.put("/deactivate", authenticateUser, deactivateAccount);
router.post("/reactivate", reactivateAccount);
router.delete("/delete", authenticateUser, deleteAccount);
router.put("/change-password", authenticateUser, changePassword);


module.exports = router;
