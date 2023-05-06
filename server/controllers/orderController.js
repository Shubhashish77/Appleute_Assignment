const Order = require('../models/Order');

exports.createOrder = async (req, res) =>{
    const newOrder = new Order(req.body);
    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err){
        res.status(500).json(err.message);
    }
}

exports.getUserOrder = async (req,res) =>{
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.status(200).json(orders);
    } catch (err) {
        res.status(400).json(err.message);
    }
}