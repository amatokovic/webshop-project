const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(user) {
    return jwt.sign(
        { sub: user._id.toString(), role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );
}

async function register(req, res) {
    const { name, email, password } = req.body;

    if (!name || name.trim().length < 2) {
        return res.status(400).json({ message: "Name is required (min 2 chars)." });
    }

    if (!email || !password || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 chars." });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "User already exists." });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        name: name.trim(),
        email,
        passwordHash,
    });

    const token = signToken(user);

    res.status(201).json({
        token,
        user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
    });
}

async function login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Wrong email." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Wrong password." });

    const token = signToken(user);

    res.json({
        token,
        user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
    });
}

module.exports = { register, login };
