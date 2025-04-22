const mongoose = require("mongoose")
const Users = require("../models/Users.js")
const jwt = require("jsonwebtoken")



const UserAuth = async (req, res, next) => {
    try {

        const { token } = req.cookies
        if (!token) {
            // return res.status(401).send("Unauthorized: No token provided");
            return res.redirect("/login")
        }
        const decode = await jwt.verify(token, process.env.JWT_SECRET)
        const user = await Users.findById(decode.id)
        if (!user) {
            return res.send("Unauthroized Access")
        }

        console.log(user)
        req.users = user
        next()


    } catch (error) {
        res.redirect("login.ejs")
    }
}

module.exports = UserAuth