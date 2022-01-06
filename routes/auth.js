const express = require("express");
const router = express.Router()
const { signout, signup, signin, isSignedIn } = require("../controllers/auth")
const { check } = require("express-validator")

// router.get("/signout", (req,res) => {
//     res.send("user signout")
// })

router.post("/signup", [
    check("name", "name should be atleast 3 char long").isLength({ min: 3 }),
    check("email", "email is required").isEmail({ min: 3 }),
    check("password", "password should be atleast 3 char long").isLength({ min: 3 })
], signup)

router.post("/signin", [
    check("email", "email is required").isEmail({ min: 3 }),
    check("password", "password should be atleast 3 char long").isLength({ min: 3 })
], signin)

router.get("/signout", signout)

// router.get("/test", isSignedIn, (req, res) => {
//     res.send("Protected route present")
// })

module.exports = router