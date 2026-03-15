const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Cuando alguien pida GET a /api/products, ejecuta el controlador
router.get('/', productController.getAllProducts);

module.exports = router;