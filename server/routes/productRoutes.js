const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/',authController.protect, productController.getAllProduct);
router.get('/:category', productController.getProductByCategory);
router.post('/', productController.createProduct);

module.exports = router;