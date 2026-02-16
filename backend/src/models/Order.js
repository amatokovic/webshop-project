const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        items: { type: [orderItemSchema], required: true, validate: v => v.length > 0 },

        paymentMethod: { type: String, enum: ["cod"], default: "cod" },
        status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },

        total: { type: Number, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
