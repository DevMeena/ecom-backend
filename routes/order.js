const express = require("express")
const router = express.Router()

const { updateStock } = require("../controllers/product")
const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth")
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user")
const { getOrderById, createOrder, getAllOrders, getOrderStatus, updateStatus } = require("../controllers/order")

// params
router.param("userId", getUserById)
router.param("orderId", getOrderById)

// routes
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder) // create
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders) // read
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus) // read order status
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus) // update order status

module.exports = router