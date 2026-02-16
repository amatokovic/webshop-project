const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDb } = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const ratesRoutes = require("./routes/rates.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

const allowedOrigins = [
    "http://localhost:4200",
    "https://webshop-project-frontend.onrender.com",
];

app.use(express.json());

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) return callback(null, true);

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
};

app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));

app.get("/api/health", (req, res) => {
    res.json({ ok: true, message: "Backend radi!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/rates", ratesRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await connectDb();
        app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
    } catch (err) {
        console.error("Failed to start:", err);
        process.exit(1);
    }
}

start();
