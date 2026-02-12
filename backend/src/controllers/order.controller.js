const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

async function createOrder(req, res) {
    try {
        const userId = req.user.sub;
        const { items, paymentMethod } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Order must have at least one item." });
        }

        const normalized = items.map((i) => ({
            productId: String(i.productId || i.product || ""),
            quantity: Number(i.quantity || 0),
        }));

        for (const i of normalized) {
            if (!mongoose.Types.ObjectId.isValid(i.productId)) {
                return res.status(400).json({ message: "Invalid productId in items." });
            }
            if (!Number.isInteger(i.quantity) || i.quantity < 1) {
                return res.status(400).json({ message: "Quantity must be integer >= 1." });
            }
        }

        const productIds = normalized.map((i) => i.productId);
        const products = await Product.find({ _id: { $in: productIds } }).lean();

        if (products.length !== productIds.length) {
            return res.status(400).json({ message: "Some products not found." });
        }

        const pMap = new Map(products.map((p) => [String(p._id), p]));

        let total = 0;
        const orderItems = [];

        for (const i of normalized) {
            const p = pMap.get(i.productId);

            if (p.stock < i.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${p.name}. Available: ${p.stock}`,
                });
            }

            const lineTotal = Number((p.price * i.quantity).toFixed(2));
            total = Number((total + lineTotal).toFixed(2));

            orderItems.push({
                product: p._id,
                name: p.name,
                price: p.price,
                imageUrl: p.imageUrl,
                quantity: i.quantity,
                lineTotal,
            });
        }

        for (const i of normalized) {
            await Product.updateOne(
                { _id: i.productId, stock: { $gte: i.quantity } },
                { $inc: { stock: -i.quantity } }
            );
        }

        const order = await Order.create({
            user: userId,
            items: orderItems,
            total,
            paymentMethod: paymentMethod === "cod" ? "cod" : "cod",
            status: "pending",
        });

        res.status(201).json(order);
    } catch (e) {
        console.error("createOrder error:", e);
        res.status(500).json({ message: "Failed to create order." });
    }
}

async function getMyOrders(req, res) {
    try {
        const userId = req.user.sub;
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .lean();
        res.json(orders);
    } catch (e) {
        console.error("getMyOrders error:", e);
        res.status(500).json({ message: "Failed to load orders." });
    }
}

async function getAllOrders(req, res) {
    try {
        const orders = await Order.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .lean();
        res.json(orders);
    } catch (e) {
        console.error("getAllOrders error:", e);
        res.status(500).json({ message: "Failed to load orders." });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowed = ["pending", "paid", "shipped", "cancelled"];
        if (!allowed.includes(status)) {
            return res.status(400).json({ message: "Invalid status." });
        }

        const updated = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).lean();

        if (!updated) return res.status(404).json({ message: "Order not found." });

        res.json(updated);
    } catch (e) {
        console.error("updateOrderStatus error:", e);
        res.status(500).json({ message: "Failed to update order." });
    }
}

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
};
