const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        imageUrl: { type: String },
        quantity: { type: Number, required: true, min: 1 },
        lineTotal: { type: Number, required: true },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        items: { type: [orderItemSchema], required: true, default: [] },

        total: { type: Number, required: true },

        paymentMethod: { type: String, enum: ["cod"], default: "cod" },
        status: {
            type: String,
            enum: ["pending", "paid", "shipped", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
