const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.ObjectId,
            ref: "User", 
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
    },
    { timestamps: true }
);


cartSchema.pre(/^find/, function (next) {
    this.populate({
      path: "userId",
    }).populate({
        path: "products.productId",
    });

    next();
});


const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;