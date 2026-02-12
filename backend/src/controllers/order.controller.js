const Order = require("../models/Order");
const Product = require("../models/Product");

async function createOrder(req, res) {
    try {
        const userId = req.user.sub;
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty." });
        }

        let total = 0;

        for (let item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({ message: "Product not found." });
            }

            total += product.price * item.quantity;
        }

        const order = await Order.create({
            userId,
            items,
            totalPrice: total,
        });

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: "Order failed." });
    }
}

async function getMyOrders(req, res) {
    const userId = req.user.sub;

    const orders = await Order.find({ userId }).populate("items.productId");

    res.json(orders);
}

module.exports = { createOrder, getMyOrders };
