const express = require('express');
const router = express.Router();

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

// Importamos el modelo (le dejamos el nombre Producto para que sea más claro)
const Producto = require('../models/Producto.js');

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

// 1. CREAR LA ORDEN (Validando contra MySQL)
router.post("/create-order", async (req, res) => {
    try {
        const { carrito } = req.body;
        const accessToken = await getAccessToken();

        let totalServidor = 0;

        // Usamos un bucle for...of para poder meter un 'await' adentro e ir a buscar a MySQL uno por uno
        for (const item of carrito) {
            const productoReal = await Producto.findByPk(item.id); // Consulta directa por ID (Primary Key)
            if (productoReal) {
                // Ojo: validamos también que haya stock suficiente antes de cobrarle
                if (productoReal.stock < item.cantidad) {
                    return res.status(400).json({ error: `Stock insuficiente para: ${productoReal.nombre}` });
                }
                totalServidor += parseFloat(productoReal.precio) * parseInt(item.cantidad);
            }
        }

        const response = await fetch(`${base}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
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
        console.error("Error en PayPal al crear orden:", error);
        res.status(500).json({ error: "Error al crear la orden" });
    }
});

// 2. CAPTURAR EL PAGO Y DESCONTAR STOCK
router.post("/capture-order", async (req, res) => {
    try {
        // !!! IMPORTANTE: Recibimos también el carrito desde el frontend !!!
        const { orderID, carrito } = req.body; 
        const accessToken = await getAccessToken();
        
        const response = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();

        // Si la plata entró con éxito...
        if (data.status === "COMPLETED") {
            console.log("💰 Pago aprobado por PayPal. Descontando stock en MySQL...");

            // Recorremos el carrito e impactamos en la base de datos
            for (const item of carrito) {
                const producto = await Producto.findByPk(item.id);
                if (producto) {
                    // decrement() le resta de forma segura a la columna 'stock' la cantidad enviada
                    await producto.decrement('stock', { by: item.cantidad });
                    console.log(`📉 Stock reducido para [ID ${item.id}]: -${item.cantidad} unidades.`);
                }
            }
        }

        res.json(data);
    } catch (error) {
        console.error("Error en PayPal al capturar pago:", error);
        res.status(500).json({ error: "Error al capturar el pago" });
    }
});

module.exports = router;