const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.ObjectId,
                    ref: "Product"
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
        amount: { type: Number, required: true },
        address: { 
            type: Object, 
            required: true 
        },
        status: { type: String, default: "pending" },
    },
    { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
    this.populate({
        path: "userId",
        select: "name email"
    }).populate({
        path: "products.productId",
        select: "title categories"
    });

    next();
});


const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
