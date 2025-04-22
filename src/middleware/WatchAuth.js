const mongoose = require("mongoose")
const Users = require("../models/Users.js")
const jwt = require("jsonwebtoken")
const Movies = require("../models/Movies.js")



const WatchAuth = async (req, res, next) => {
    try {
        // const ids = req.users.id
        const id = req.params.id

        const movie = await Movies.findById(id)
        console.log(id);


        // res.render("watchmovie.ejs", { url: movie.movieUrl })
        const { token } = req.cookies

        if (!token) {
            // return res.status(401).send("Unauthorized: No token provided");
            return res.render("watchmovie.ejs", { url: movie.movieUrl, moviename: movie.movieName });
        }
        const decode = await jwt.verify(token, process.env.JWT_SECRET)
        const user = await Users.findById(decode.id)
        if (!user) {
            return res.render("watchmovie.ejs", { url: movie.movieUrl, moviename: movie.movieName }); // Redirect to login if user not found
        }

        res.render("watchmovielogin.ejs", { url: movie.movieUrl, moviename: movie.movieName });

        // console.log(user)
        // req.users = user
        // next()


    } catch (error) {
        res.redirect("/")
    }
}

module.exports = WatchAuth