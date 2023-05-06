const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv");

const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');

const app = express();

dotenv.config({ path: "./config.env" });
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cors());


const DB = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB connection successful"))
    .catch((err) => console.log(err));


app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/order', orderRouter);


app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Cant find ${req.originalUrl} on this server!`,
  });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});