const express = require("express");
const router = express.Router();

const { createOrder, getMyOrders } = require("../controllers/order.controller");
const { requireAuth } = require("../middleware/auth");

router.post("/", requireAuth, createOrder);
router.get("/my", requireAuth, getMyOrders);

module.exports = router;
