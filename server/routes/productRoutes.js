const express = require('express');
const router = express.Router();
// ¡OJO ACÁ! Asegurate de tener las llaves { } para extraer la función del objeto
const { getProducts } = require('../controllers/productController');

// Tu ruta que antes fallaba en la línea 8
router.get('/', getProducts); 

module.exports = router;