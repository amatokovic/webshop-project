const User = require("../models/User");

async function listUsers(req, res) {
    const users = await User.find()
        .sort({ createdAt: -1 })
        .select("name email role createdAt");
    res.json(users);
}

module.exports = { listUsers };
