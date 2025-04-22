const mongoose = require("mongoose");
const Users = require("../models/Users.js");
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/Admin.js")

const Adminware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            // return res.status(401).send("Unauthorized: No token provided");
            v
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await AdminUser.findById(decode.id);
        if (!user) {
            // return res.status(403).send("Access Denied: Only admins can perform this action");
            return res.redirect("/admin")
        }

        req.user = user; // Set user details in req
        next();
    } catch (error) {
        console.error("Error in Adminware:", error.message);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = Adminware;