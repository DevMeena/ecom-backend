const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category") // we can also sort it too
    .exec((err, product) => {
        if(err) {
            return res.status(400).json({
                error: "Product not found"
            })
        }
        req.product = product
        next()
    })
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, (err, fields, file) => {
        if(err) {
            return res.status(400).json({
                error: "problem with image"
            })
        }

        // destructuring fields
        const { price, description, name, category, stock } = fields

        // validation ( express validator in routes should be used )
        if( !name || !price || !description || !category || !stock ) {
            return res.status(400).json({
                error: "Please include all the fields"
            })
        }

        let product = new Product(fields)

        // handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "file size is too big"
                })
            }

            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

            // save to DB
        product.save((err, product) => {
            if(err) {
                return res.status(400).json({
                    error: "Problem with saving Tshirt"
                })
            }   
            res.json(product)
        })
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

// middleware to load photo in bg (making app fast)
exports.photo = (req, res, next) => {
    if(req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    } else {
       return res.send(false)
    }
    next()
}

exports.deleteProduct = (req, res) => {
    let product = req.product
    product.remove((err, deletedProduct) => {
        if(err) {
            return res.status(400).json({
                error: "Problem with deleting Tshirt"
            })
        }
        res.json({
            message: "Deletion was Successfull",
            deletedProduct
        })
    })
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, (err, fields, file) => {
        if(err) {
            return res.status(400).json({
                error: "problem with image"
            })
        }

        // updation code
        let product = req.product
        product = _.extend(product, fields)

        // handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "file size is too big"
                })
            }

            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

            // save to DB
        product.save((err, product) => {
            if(err) {
                return res.status(400).json({
                    error: "Problem with updating Tshirt"
                })
            }   
            res.json(product)
        })
    })
}

exports.getAllProducts = (req, res) => {
    
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.limit ? req.query.sortBy : "_id"

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
        if(err) {
            return res.status(400).json({
                error: "No product found"
            })
        }
        res.json(products)
    })
}

// can be done by using 2 middlewares too
exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: { stock: -prod.count, sold: +prod.count }}
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err) {
            return res.status(400).json({
                error: "Bulk operation failed"
            })
        }
        next()
    })
}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if(err) {
            return res.status(400).json({
                error: "No categories found"
            })
        }
        res.json(category)
    })
}