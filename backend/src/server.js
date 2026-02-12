const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDb } = require("./config/db");

const authRoutes = require("./routes/auth.routes");

const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");

const ratesRoutes = require("./routes/rates.routes");

const app = express();
app.use(cors({
    origin: "https://webshop-project-frontend.onrender.com"
}));
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ ok: true, message: "Backend radi!" });
});

app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

app.use("/api/rates", ratesRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await connectDb();
        app.listen(PORT, () =>
            console.log(`API running on http://localhost:${PORT}`)
        );
    } catch (err) {
        console.error("Failed to start:", err);
        process.exit(1);
    }
}

start();
