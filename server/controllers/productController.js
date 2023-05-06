const Product = require('../models/productModel');

exports.getAllProduct = async ( req, res ) => {
    try {
       const products = await Product.find();
       res.status(200).json(products);
    } catch (err) {
       res.status(404).json({message: err.message});
    }
};

exports.getProductByCategory = async (req, res) => {
    console.log(req.params.category);
    try {
        const products = await Product.find({ categories: { $in: req.params.category } });
        res.status(200).json(products);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

exports.createProduct = async ( req, res ) => {
    const product = req.body;
    console.log(product);
    try {
        const newProduct = await Product.create(product); 
        res.status(201).json(newProduct);
        
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}