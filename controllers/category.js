const category = require("../models/category")
const Category = require("../models/category")

exports.getCategoryById = (req, res, next, id) => {
    
    Category.findById(id).exec((err, category) => {
        if(err) {
            return res.status(400).json({
                error: "Category not found in DB"
            })
        }
        req.category = category
        next()
    })
}

exports.createCategory = (req, res) => {
    const category = new Category(req.body)
    category.save((err, category) => {
        if(err) {
            console.log(err);
            return res.status(400).json({
                error: "Unable to save Category in DB"
            })
        }
        res.json({category})
    })
}

exports.getCategory = (req, res) => {
    return res.json(req.category)
}

exports.getCategories = (req, res) => {
    Category.find().exec((err, categories) => {
        if(err) {
            return res.status(400).json({
                error: "Unable to get Categories from DB"
            })
        }
        res.json(categories)
    })
}

exports.updateCategory = (req, res) => {
    const category = req.category
    category.name = req.body.name

    category.save((err, updatedCategory) => {
        if(err) {
            return res.status(400).json({
                error: "Unable to update Category"
            })
        }
        res.json(updatedCategory)
    })

}

exports.deleteCategory = (req, res) => {
    const category = req.category
    
    category.remove((err, category) => {
        if(err) {
            return res.status(400).json({
                error: "Unable to delete Category"
            })
        }
        res.json({
            message: `${category.name} Category successfully deleted`
        })
    })
}