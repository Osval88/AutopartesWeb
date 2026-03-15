const Product = require('../models/productModel');

const getAllProducts = (req, res) => {
    try {
        const products = Product.getAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos" });
    }
};

module.exports = { getAllProducts };