const express = require("express")
const router = express.Router()
const { signup, login, viewprofile, logout, adminlogin, addmovies, adminsignup, editmovie, allmovies } = require("../controllers/Users.js")
const UserAuth = require("../middleware/UserAuth.js")
const HomeAuth = require("../middleware/HomeAuth.js")
const WatchAuth = require("../middleware/WatchAuth.js")
const Adminware = require("../middleware/Adminware.js")
const Movies = require("../models/Movies.js")
const Users = require("../models/Users.js")
const bcrypt = require("bcrypt")


router.post("/login", login)
router.post("/signup", signup)
router.get("/logout", logout)
router.get("/profile/editprofile", UserAuth, viewprofile)
router.post("/profile/editprofile", UserAuth, async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.render("editprofile.ejs", { message: "All fields are required" });
        }

        const user = req.users.id;
        const userdata = await Users.findById(user);

        if (!userdata) {
            return res.render("editprofile.ejs", { message: "User not found. Try again." });
        }

        if (username === userdata.username) {
            return res.render("editprofile.ejs", { message: "Username already used" });
        }

        if (email === userdata.email) {
            return res.render("editprofile.ejs", { message: "Email already used" });
        }

        const pass = await bcrypt.compare(password, userdata.password);
        if (!pass) {
            return res.render("editprofile.ejs", { message: "Incorrect password" });
        }

        await Users.findByIdAndUpdate(userdata._id, { username, email });

        res.render("editprofile.ejs", { message: "Profile updated successfully" });
        // res.send(email, username)
    } catch (error) {
        console.error("Error in editprofile route:", error);
        res.render("editprofile.ejs", { message: "Server is Busy Try Agin SomeTime" });
    }
});


router.post("/admin", adminlogin)
router.get("/admin", (req, res) => { res.render("adminlogin.ejs") })
router.get("/admin/home", Adminware, async (req, res) => {
    try {
        const username = req.user;
        const movies = await Movies.find();

        res.render("adminprofile.ejs", {
            username: username.username,
            movies: movies // Pass the entire movies array
        });
    } catch (error) {
        res.status(500).send("Error fetching admin home: " + error.message);
    }
});
router.post("/admin/signup", adminsignup)
router.post("/admin/addmovies", Adminware, addmovies)
router.get("/admin/addmovies", Adminware, (req, res) => {
    try {

        res.render("addmovie.ejs")

    } catch (error) {
        res.redirect("/admin/home")
    }
})
router.get("/admin/editmovie/:id", Adminware, editmovie)
router.post("/admin/editmovie/:movieId", async (req, res) => {
    try {
        const { movieId } = req.params;
        const { movieName, movieUrl, movieImage, category } = req.body;

        // Update the movie in the database
        await Movies.findByIdAndUpdate(movieId, {
            movieName,
            movieUrl,
            movieImage,
            category,
        });

        res.redirect("/admin/home"); // Redirect to admin home after editing
    } catch (error) {
        res.status(500).send("Error updating movie: " + error.message);
    }
});
router.get("/admin/deletemovie/:id", Adminware, async (req, res) => {
    try {
        const id = req.params.id
        const findmovie = await Movies.findByIdAndDelete(id)

        res.redirect("/admin/home")

    } catch (error) {
        res.send(error)
    }
})
router.get("/admin/profile/edit", Adminware, async (req, res) => {
    try {

        const users = req.user
        const email = users.email
        const username = users.username
        res.send(email + " " + username)

    } catch (error) {
        res.send(error)
    }
})
router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.get("/", HomeAuth)
router.get("/admin/profile", Adminware, allmovies)
router.get("/profile", UserAuth, async (req, res) => {

    const movies = await Movies.find();

    res.render("profile.ejs", {
        movies: movies // Pass the entire movies array
    });
})

router.post("/watch/:id", async (req, res) => {
    try {
        const id = req.params.id
        res.send(id)

    } catch (error) {
        res.redirect("/home")
    }
})
// router.get("/watch/:id", WatchAuth, async (req, res) => {
//     try {
//         const ids = req.users.id
//         const id = req.params.id

//         const movie = await Movies.findById(id)
//         console.log(ids);


//         res.render("watchmovie.ejs", { url: movie.movieUrl })
//     } catch (error) {
//         res.redirect("/home")
//     }
// })
router.get("/watch/:id", WatchAuth)






module.exports = router