const express = require("express");
const router = express.Router();

router.get("/eur-usd", async (req, res) => {
    try {
        const r = await fetch("https://api.frankfurter.app/latest?from=EUR&to=USD");
        const data = await r.json();

        res.json({
            base: data.base,
            date: data.date,
            rate: data.rates.USD,
        });
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch exchange rate." });
    }
});

module.exports = router;
