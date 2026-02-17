const express = require("express");
const router = express.Router();

const { requireAuth, requireAdmin } = require("../middleware/auth");
const {
    getAllUsers,
    deleteUser,
} = require("../controllers/user.controller");

router.get("/", requireAuth, requireAdmin, getAllUsers);
router.delete("/:id", requireAuth, requireAdmin, deleteUser);

module.exports = router;
