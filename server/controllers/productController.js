// Importamos el modelo Producto que acabamos de usar con éxito
const Producto = require('../models/Producto');

const getProducts = async (req, res) => {
    try {
        // Buscamos absolutamente todos los productos guardados en MySQL
        const products = await Producto.findAll();
        
        // Se los enviamos al frontend exactamente en el mismo formato que antes
        res.json(products);
    } catch (error) {
        console.error("Error al obtener los productos de la base de datos:", error);
        res.status(500).json({ message: "Error interno del servidor al cargar el catálogo." });
    }
};

module.exports = {
    getProducts
};