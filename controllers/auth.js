const User = require("../models/user")
const { validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const expressJwt = require("express-jwt")

exports.signup = (req, res) => {
    // console.log("REQ BODY", req.body);
    // res.json({
    //     message: "signup works"
    // })


    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    const user = new User(req.body)

    user.save((err, user)=>{
        if(err) {
            console.log("backend signup err");
            return res.status(400).json({
                err: "not able to save user in DB"
            })
        }

        // res.json(user)
        // console.log("signup works");

        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        })

    })

}

exports.signin = (req, res) => {
    
    const {email, password} = req.body // destructuring

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: "Email not found"
            })
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and password don't match"
            })
        }
        
        const token = jwt.sign({_id: user._id}, process.env.SECRET) // created token

        res.cookie("token", token, {expire: new Date() + 9999}) // puts token in cookie

        // send res to Front End

        const {_id, name, email, role} = user

        return res.json({token, user: {_id, name, email, role} })
        

    })

}

exports.signout = (req, res) => {

    res.clearCookie("token")

    res.json({
        message: "signout success"
    })
}

// protected routes

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth",
    // algorithms: ['HS256']
})


// custom middlewares 

exports.isAuthenticated = (req, res, next) => {
    // console.log("is Auth check");
    // let checker = req.profile && req.auth && req.profile._id == req.auth._id
    // console.log(checker);
    // if(!checker){
    //     console.log("failure");
    // } else {
    //     console.log("success");
    // }

    console.log("called");

    let checker = req.profile && req.auth && req.profile._id == req.auth._id // should be double equals not triple

    if(!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED"
        })
    }

    next()
}

exports.isAdmin = (req, res, next) => {
    console.log("isAdmin check");
    if(req.profile.role === 0) {
        return res.status(403).json({
            error: "You are not Admin"
        })
    }
    next()
}