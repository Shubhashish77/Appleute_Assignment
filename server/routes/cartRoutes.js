const express = require('express');
const cartController = require("../controllers/cartController");

const router = express.Router();

router.post('/', cartController.createCart);
router.get('/', cartController.getAllCart);
router.get('/:userId', cartController.getCart);


module.exports = router;