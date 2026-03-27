const express = require('express');
const router = express.Router();
// Si tu Node es < 18, descomenta la siguiente línea y haz: npm install node-fetch@2
// const fetch = require('node-fetch'); 

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

const productosDB = require('../data/products.json');

const getAccessToken = async () => {
    const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: { Authorization: `Basic ${auth}` },
    });
    const data = await response.json();
    return data.access_token;
};

router.post("/create-order", async (req, res) => {
    try {
        const { carrito } = req.body;
        const accessToken = await getAccessToken();

        // VALIDACIÓN DE PRECIOS REALES
        let totalServidor = 0;
        carrito.forEach(item => {
            // Buscamos el producto en tu JSON para usar el precio real
            const productoReal = productosDB.find(p => p.id === item.id);
            if (productoReal) {
                totalServidor += parseFloat(productoReal.precio) * parseInt(item.cantidad);
            }
        });

        const response = await fetch(`${base}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [{
                    amount: { 
                        currency_code: "USD", 
                        value: totalServidor.toFixed(2) 
                    } 
                }],
            }),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error en PayPal:", error);
        res.status(500).json({ error: "Error al crear la orden" });
    }
});

router.post("/capture-order", async (req, res) => {
    try {
        const { orderID } = req.body;
        const accessToken = await getAccessToken();
        const response = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error al capturar el pago" });
    }
});

module.exports = router;