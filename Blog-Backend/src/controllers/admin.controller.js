const User = require("../models/user.model");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Admin getAllUsers error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.remove();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Admin deleteUser error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();
    res.status(200).json({ message: "User role updated", user });
  } catch (err) {
    console.error("Admin updateUserRole error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports={
    getAllUsers,
    deleteUser,
    updateUserRole
}
