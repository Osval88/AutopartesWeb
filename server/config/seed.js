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

        // CON ESTO OBLIGAMOS A QUE TODO USE LA MISMA CONEXIÓN
        await sequelize.transaction(async (t) => {
            // 1. Desactivamos en esta conexión
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;', { transaction: t });

            // 2. Sincronizamos usando la misma transacción
            await sequelize.sync({ force: true, transaction: t }); 
            console.log(' Tabla "productos" creada/reiniciada con éxito.');

            // 3. Volvemos a activar
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;', { transaction: t });

            // 4. Insertamos los productos
            await Producto.bulkCreate(productosALevantar, { transaction: t });
        });

        console.log(' ¡Base de datos poblada con éxito con los productos de AutopartesWeb! 🚀');
        process.exit(0); 
    } catch (error) {
        console.error('❌ Error al migrar los datos:', error);
        process.exit(1);
    }
}

poblarBaseDeDatos();