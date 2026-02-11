const Category = require("../models/Category");

async function getAll(req, res) {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
}

async function create(req, res) {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required." });

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) return res.status(409).json({ message: "Category already exists." });

    const category = await Category.create({ name: name.trim(), description: description || "" });
    res.status(201).json(category);
}

module.exports = { getAll, create };
