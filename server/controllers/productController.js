const Product = require('../models/productModel');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.getAll(); 
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos" });
    }
};

module.exports = { getAllProducts };