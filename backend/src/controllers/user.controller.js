const User = require("../models/User");

async function getAllUsers(req, res) {
    const users = await User.find().select("name email role");
    res.json(users);
}

async function deleteUser(req, res) {
    const userId = req.params.id;

    if (req.user.id === userId) {
        return res.status(400).json({ message: "You cannot delete yourself." });
    }

    const deleted = await User.findByIdAndDelete(userId);

    if (!deleted) {
        return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User deleted successfully." });
}

module.exports = { getAllUsers, deleteUser };
