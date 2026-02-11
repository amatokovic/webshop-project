const router = require("express").Router();
const { getAll, getById, create, update, remove } = require("../controllers/product.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.get("/", getAll);
router.get("/:id", getById);

router.post("/", requireAuth, requireAdmin, create);
router.put("/:id", requireAuth, requireAdmin, update);
router.delete("/:id", requireAuth, requireAdmin, remove);

module.exports = router;
