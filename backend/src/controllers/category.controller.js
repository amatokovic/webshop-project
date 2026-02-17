const Category = require("../models/Category");

async function getCategories(req, res) {
    const cats = await Category.find().sort({ name: 1 });
    res.json(cats);
}

async function createCategory(req, res) {
    const { name, description } = req.body;

    if (!name?.trim()) {
        return res.status(400).json({ message: "Name is required." });
    }

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) return res.status(409).json({ message: "Category already exists." });

    const cat = await Category.create({ name: name.trim(), description: description || "" });
    res.status(201).json(cat);
}

async function updateCategory(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name?.trim()) {
        return res.status(400).json({ message: "Name is required." });
    }

    const existing = await Category.findOne({ name: name.trim(), _id: { $ne: id } });
    if (existing) return res.status(409).json({ message: "Category name already taken." });

    const updated = await Category.findByIdAndUpdate(
        id,
        { name: name.trim(), description: description || "" },
        { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Category not found." });

    res.json(updated);
}

async function deleteCategory(req, res) {
    const { id } = req.params;

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Category not found." });

    res.json({ message: "Category deleted." });
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
