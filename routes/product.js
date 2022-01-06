const express = require("express")
const router = express.Router()

const { getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProducts, getAllUniqueCategories } = require("../controllers/product")
const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth")
const { getUserById } = require("../controllers/user")

// params
router.param("userId", getUserById)
router.param("productId", getProductById)

// routes
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct) // create
router.get("/product/:productId", getProduct) // read
router.get("/product/photo/:productId", photo) // read photo
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct) // delete
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct) // update
router.get("/products", getAllProducts) // list
router.get("/products/categories", getAllUniqueCategories) // list category
module.exports = router