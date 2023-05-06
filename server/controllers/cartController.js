const Cart = require('../models/cart');

exports.createCart = async (req, res)=>{
    try {
        const newCart = await Cart.create  (req.body);
        res.status(200).json(newCart);
    } catch (err) {
        res.status(400).json(err.message);
    }
}

exports.getCart = async (req, res) => {
    try{
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    }catch(err){
        res.status(400).json(err);
    }
}

exports.getAllCart = async (req, res) => {
    try{
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(400).json(err);
    }
}