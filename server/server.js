const express = require("express");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
require("dotenv").config();// Importante para leer el Client Secret
const paypalRoutes = require('./routes/paypal');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// Agregamos las rutas de la API
app.use("/api/products", productRoutes);
// Usar las rutas de paypal con un prefijo
app.use('/api/paypal', paypalRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});