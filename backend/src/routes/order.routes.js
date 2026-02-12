const express = require("express");
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
} = require("../controllers/order.controller");

const { requireAuth } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/admin");

router.post("/", requireAuth, createOrder);
router.get("/my", requireAuth, getMyOrders);

router.get("/", requireAuth, requireAdmin, getAllOrders);
router.patch("/:id/status", requireAuth, requireAdmin, updateOrderStatus);

module.exports = router;
