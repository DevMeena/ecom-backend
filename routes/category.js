const express = require("express")
const router = express.Router()

const { getCategoryById, createCategory, getCategory, getCategories, updateCategory, deleteCategory } = require("../controllers/category")
const { isAdmin, isSignedIn, isAuthenticated } = require("../controllers/auth")
const { getUserById } = require("../controllers/user")
const { route } = require("./user")

// params

router.param("userId", getUserById)
router.param("categoryId", getCategoryById)

// routes

// create
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory)

// read
router.get("/category/:categoryId", getCategory)
router.get("/categories", getCategories)

// update
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory)

// delete
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteCategory)

module.exports = router