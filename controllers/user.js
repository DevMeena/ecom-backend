const { orderBy } = require("lodash")
const User = require("../models/user")

// middleware
exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: "No user found"
            })
        }
        req.profile = user
        next()
    })
}

// majorly user
exports.getUser = (req, res) => {
    // TODO: get back here for passwords

    req.profile.salt = undefined
    req.profile.encry_password = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined

    return res.json(req.profile)
}

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err, user) => {
            if(err || !user) {
                return res.status(400).json({
                    error: "You are not authorized for updation"
                })
            }
            user.salt = undefined
            user.encry_password = undefined
            res.json(user)
        }
    )
}

exports.userPurchaseList = (req, res) => {
    Order.find({user: req.profile._id}).populate("user", "_id name").exec((err, order) => {
        if(err) {
            return res.status(400).json({
                error: "No Orders in this Account"
            })
        }
        return res.json(order)
    })
}

exports.pushOrderInPurchaseList = (req, res, next) => {

    let purchases = []
    console.log(req.body.order.products);
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transactionId: req.body.order.transactionId
        })
    })

    // store in DB

    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true},
        (err, purchases) => {
            if(err) {
                return res.status(400).json({
                    error: "Unable to save purchases"
                })
            }
            next()
        }
    )

}