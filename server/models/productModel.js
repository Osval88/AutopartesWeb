const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../data/products.json');

const Product = {
    getAll: async () => {
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Error leyendo el archivo:", error);
            throw error;
        }
    }
};

module.exports = Product;