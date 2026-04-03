const express = require("express");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
require("dotenv").config();
const paypalRoutes = require('./routes/paypal');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));


app.use("/api/products", productRoutes);
app.use('/api/paypal', paypalRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});