const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

async function createOrder(req, res) {
    const userId = req.user.id;
    const { items, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Order must have at least one item." });
    }

    const pm = paymentMethod === "cod" ? "cod" : "cod";

    const productIds = items.map(i => i.productId);

    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    const orderItems = [];
    let total = 0;

    for (const i of items) {
        const productId = String(i.productId);
        const p = productMap.get(productId);
        const qty = Number(i.quantity);

        if (!p) return res.status(400).json({ message: `Product not found: ${productId}` });
        if (!Number.isInteger(qty) || qty < 1) return res.status(400).json({ message: "Invalid quantity." });

        if (p.stock < qty) {
            return res.status(400).json({ message: `Not enough stock for ${p.name}.` });
        }

        p.stock -= qty;
        await p.save();

        orderItems.push({
            product: p._id,
            name: p.name,
            price: p.price,
            quantity: qty,
        });

        total += p.price * qty;
    }

    const order = await Order.create({
        user: new mongoose.Types.ObjectId(userId),
        items: orderItems,
        paymentMethod: pm,
        total,
    });

    res.status(201).json(order);
}

async function getMyOrders(req, res) {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("items.product", "imageUrl categoryId");

    res.json(orders);
}

async function getAllOrders(req, res) {
    const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate("user", "email name role")
        .populate("items.product", "imageUrl categoryId");

    res.json(orders);
}

module.exports = { createOrder, getMyOrders, getAllOrders };
