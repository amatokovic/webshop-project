const Product = require("../models/Product");

async function getAll(req, res) {
    const products = await Product.find()
        .populate("categoryId", "name")
        .sort({ createdAt: -1 });

    res.json(products);
}

async function getById(req, res) {
    const { id } = req.params;
    const product = await Product.findById(id).populate("categoryId", "name");
    if (!product) return res.status(404).json({ message: "Not found." });
    res.json(product);
}

async function create(req, res) {
    const { name, price, stock, categoryId, imageUrl } = req.body;

    if (!name || categoryId == null) return res.status(400).json({ message: "Name and categoryId are required." });
    if (price == null || Number(price) < 0) return res.status(400).json({ message: "Price must be >= 0." });
    if (stock == null || Number(stock) < 0) return res.status(400).json({ message: "Stock must be >= 0." });

    const product = await Product.create({
        name: name.trim(),
        price: Number(price),
        stock: Number(stock),
        categoryId,
        imageUrl: imageUrl || "",
    });

    res.status(201).json(product);
}

async function update(req, res) {
    const { id } = req.params;
    const { name, price, stock, categoryId, imageUrl } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Not found." });

    if (name != null) product.name = name.trim();
    if (price != null) product.price = Number(price);
    if (stock != null) product.stock = Number(stock);
    if (categoryId != null) product.categoryId = categoryId;
    if (imageUrl != null) product.imageUrl = imageUrl;

    await product.save();
    res.json(product);
}

async function remove(req, res) {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Not found." });
    res.json({ ok: true });
}

module.exports = { getAll, getById, create, update, remove };
