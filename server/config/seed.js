const sequelize = require('./db'); // Al estar en config, se importa directo como './db'
const Producto = require('../models/Producto'); 
const fs = require('fs');
const path = require('path');

async function poblarBaseDeDatos() {
    try {
        await sequelize.authenticate();
        console.log(' Conectado a MySQL para la migración...');

        const rutaJson = path.join(__dirname, '..', 'data', 'productos.json'); 
        const datosJson = fs.readFileSync(rutaJson, 'utf-8');
        const productosALevantar = JSON.parse(datosJson);

        console.log(` Leyendo ${productosALevantar.length} productos del archivo JSON...`);

        // ¡ESTO CREA LA TABLA EN PHPMYADMIN SI NO EXISTE!
        await sequelize.sync({ force: true }); 
        console.log(' Tabla "productos" creada/reiniciada con éxito.');

        await Producto.bulkCreate(productosALevantar);
        console.log(' ¡Base de datos poblada con éxito con los productos de AutopartesWeb! 🚀');
        
        process.exit(0); 
    } catch (error) {
        console.error('❌ Error al migrar los datos:', error);
        process.exit(1);
    }
}

poblarBaseDeDatos();