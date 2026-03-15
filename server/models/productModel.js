const fs = require('fs');
const path = require('path');

// Ruta al archivo JSON
const filePath = path.join(__dirname, '../data/products.json');

const Product = {
    getAll: () => {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    }
};

module.exports = Product;