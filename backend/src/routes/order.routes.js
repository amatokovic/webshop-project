const express = require("express");
const router = express.Router();

const { createOrder, getMyOrders, getAllOrders } = require("../controllers/order.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.post("/", requireAuth, createOrder);
router.get("/my", requireAuth, getMyOrders);
router.get("/", requireAuth, requireAdmin, getAllOrders);

module.exports = router;
