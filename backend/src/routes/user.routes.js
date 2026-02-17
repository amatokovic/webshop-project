const express = require("express");
const router = express.Router();

const { requireAuth, requireAdmin } = require("../middleware/auth");
const { listUsers } = require("../controllers/user.controller");

router.get("/", requireAuth, requireAdmin, listUsers);

module.exports = router;
