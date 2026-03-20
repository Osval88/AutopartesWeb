const fs = require('fs').promises; // Importamos la versión de promesas
const path = require('path');

const filePath = path.join(__dirname, '../data/products.json');

const Product = {
    // Ahora la función es 'async'
    getAll: async () => {
        try {
            // Usamos 'await' para esperar la lectura sin bloquear el servidor
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Error leyendo el archivo:", error);
            throw error; // Lanzamos el error para que el controlador lo atrape
        }
    }
};

module.exports = Product;