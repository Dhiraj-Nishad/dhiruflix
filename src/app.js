const express = require("express")
const mongoose = require("mongoose")
const connectDB = require("./config/connectDB.js")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
dotenv.config()
const path = require("path")
const router = require("./routes/Users.js")


const app = express()
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/", router)
app.use((req, res) => {
    // res.send("Invalid Page Go Back")
    res.render("error.ejs")
})



const port = process.env.PORT || 2000
app.listen(port, () => console.log(`Server is Running on localhost:${port}`)
)
