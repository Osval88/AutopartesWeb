const Product = require('../models/productModel');

// En tu archivo de controlador
const getAllProducts = async (req, res) => { // Agregamos async aquí
    try {
        // Agregamos await aquí para esperar al modelo
        const products = await Product.getAll(); 
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos" });
    }
};

module.exports = { getAllProducts };