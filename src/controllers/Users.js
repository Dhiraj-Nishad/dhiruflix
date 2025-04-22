const mongoose = require("mongoose")
const Users = require("../models/Users.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Movies = require("../models/Movies.js")
const AdminUser = require("../models/Admin.js")



const signup = async (req, res) => {
    try {

        const { username, email, password } = req.body
        const pass = await bcrypt.hash(password, 10)

        const findusername = await Users.findOne({ username: username })
        if (findusername) {
            return res.render("signup.ejs", { message: "Email And Password Already Used" });
        }
        const findemail = await Users.findOne({ email: email })
        if (findemail) {
            return res.render("signup.ejs", { message: "Email And Password Already Used" });
        }



        const users = await Users.create({ username, email, password: pass });
        // res.json({ message: "Signup SuccessFull ", users })
        // res.render("login.ejs")
        res.redirect("/login")

    } catch (error) {
        res.send(error)
        res.render("signup.ejs", { message: "Email And Password Already Used" });
    }
}


const login = async (req, res) => {
    try {

        const { email, password } = req.body
        const Email = await Users.findOne({ email: email })
        if (!Email) {
            // return res.status(400).json({ message: "Invalid Email And Password" })
            return res.render("login.ejs", { message: "Invalid Email And Password" });
        }

        const Password = await bcrypt.compare(password, Email.password)
        if (!Password) {
            // return res.status(400).json({ message: "Invalid Email And Password" })
            return res.render("login.ejs", { message: "Invalid Email And Password" });

        }

        const Token = await jwt.sign({ id: Email._id, username: Email.username }, process.env.JWT_SECRET)

        res.cookie("token", Token)
        // res.status(200).json({ Message: "Login Successfull", Token })
        // res.render("profile.ejs")
        res.redirect("/profile")


    } catch (error) {
        // res.send(error)
        return res.render("login.ejs", { message: "Invalid Email And Password" });

    }
}

const logout = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie("token");
        // Redirect to the login page
        res.redirect("/login");
    } catch (error) {
        console.error("Error during logout:", error);
        // Redirect to the login page with an error message
        res.render("login.ejs", { message: "Error during logout. Please try again." });
    }
};

const viewprofile = async (req, res) => {
    try {

        console.log("User Object:", req.users); // Debug log
        if (!req.users) {
            return res.status(401).send("User not authenticated");
        }

        const email = req.users.email;
        const username = req.users.username;
        // res.json({ email: email, username: username });
        res.render("editprofile.ejs", { username: username, email: email })
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const adminsignup = async (req, res) => {
    try {

        const { username, email, password } = req.body
        const pass = await bcrypt.hash(password, 10)

        const users = await AdminUser.create({ username, email, password: pass });
        res.json({ message: "Signup SuccessFull ", users })

    } catch (error) {
        res.send(error)
    }
}

const adminlogin = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debug log
        const { email, password } = req.body;
        console.log("Email:", email, "Password:", password); // Debug log

        const adminuser = await AdminUser.findOne({ email: email });
        if (!adminuser) {
            // return res.status(401).send("Invalid Admin Login");
            return res.render("adminlogin.ejs", { message: "Invalid Email And Password" });

        }

        const pass = await bcrypt.compare(password, adminuser.password);
        if (!pass) {
            // return res.status(401).send("Invalid Admin Login");
            return res.render("adminlogin.ejs", { message: "Invalid Email And Password" });

        }

        const Token = await jwt.sign(
            { id: adminuser._id, username: adminuser.username, email: adminuser.email },
            process.env.JWT_SECRET
        );

        res.cookie("token", Token);
        // res.status(200).json({ message: "Admin Login Successful", Token });
        res.redirect("/admin/home")
    } catch (error) {
        // res.status(500).send(error.message);
        res.redirect("adminlogin.ejs")
    }
}


const addmovies = async (req, res) => {

    try {

        const email = req.user.email
        const findadmin = await AdminUser.findOne({ email: email })
        console.log(findadmin);
        if (!findadmin) {
            return res.send("You are not admin ")
        }


        const { movieName, movieUrl, movieImage, category } = req.body

        const findMovie = await Movies.findOne({ movieName })
        if (findMovie) {
            return res.send("Movie Alredy Exists")
        }

        const saveMovie = await Movies.create({ movieName, movieUrl, movieImage, category })
        // res.json({ Message: "Movies Added Successfully", saveMovie })
        res.redirect("/admin/home")


    } catch (error) {
        console.log(error)
    }
};

const editmovie = async (req, res) => {
    try {
        const id = req.params.id;
        const findmovie = await Movies.findById(id);

        if (!findmovie) {
            return res.status(404).send("Movie not found");
        }

        // Pass the movie object to the EJS file
        res.render("editmovie.ejs", { movie: findmovie });
    } catch (error) {
        console.error("Error in editmovie:", error);
        res.redirect("/login");
    }
};

const allmovies = async (req, res) => {
    try {

        // const allmovie = await Movies.find()
        // if (!allmovie) {
        //     return res.send("No Movies")
        // }


        const movies = await Movies.find();

        res.render("home.ejs", {
            movies: movies // Pass the entire movies array
        });

        // res.render("home.ejs")

    } catch (error) {
        res.send(error)
    }
}

module.exports = { signup, login, viewprofile, adminlogin, addmovies, adminsignup, editmovie, allmovies, logout }