const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRoles } = require("../middlewares/authenticateUser");
const { getAllUsers, deleteUser, updateUserRole } = require("../controllers/admin.controller");

// All routes are protected for admin only
router.use(authenticateUser, authorizeRoles("admin"));

// Get all users
router.get("/users", getAllUsers);

// Delete a user
router.delete("/users/:id", deleteUser);

// Update user role
router.put("/users/:id/role", updateUserRole);

module.exports = router;
