const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

// multiple schema in single file

const ProductCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    count: Number,
    price: Number
})

// Cart or Order

const orderSchema = new mongoose.Schema({
    products: [ProductCartSchema],
    transaction_id: {},
    amount: Number,
    address: String,
    status: {
        type: String,
        default: "Recieved",
        enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"]
    },
    updated: Date,
    user: {
        type: ObjectId,
        ref: "User"
    }
}, {timestamps: true})



const Order = mongoose.model("Order", orderSchema)
const ProductCart = mongoose.model("ProductCart", ProductCartSchema)

module.exports = {Order, ProductCart}