const router = require("express").Router();
const { getAll, create } = require("../controllers/category.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.get("/", getAll);

router.post("/", requireAuth, requireAdmin, create);

module.exports = router;
