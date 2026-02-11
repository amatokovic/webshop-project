const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        qty: { type: Number, required: true, min: 1 },
        priceAtPurchase: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        items: { type: [orderItemSchema], default: [] },

        total: { type: Number, required: true, min: 0 },
        status: { type: String, enum: ["NEW", "PAID", "CANCELLED"], default: "NEW" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
