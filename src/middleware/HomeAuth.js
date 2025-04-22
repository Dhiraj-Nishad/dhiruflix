const mongoose = require("mongoose")
const Users = require("../models/Users.js")
const jwt = require("jsonwebtoken")
const Movies = require("../models/Movies.js")



const HomeAuth = async (req, res, next) => {
    try {

        const { token } = req.cookies
        const movies = await Movies.find();

        if (!token) {
            // return res.status(401).send("Unauthorized: No token provided");
            return res.render("home.ejs", {
                movies: movies // Pass the entire movies array
            });
        }
        const decode = await jwt.verify(token, process.env.JWT_SECRET)
        const user = await Users.findById(decode.id)
        if (!user) {
            return res.redirect("/login"); // Redirect to login if user not found
        }

        res.redirect("/profile")

        console.log(user)
        req.users = user
        // next()


    } catch (error) {
        res.redirect("/")
    }
}

module.exports = HomeAuth