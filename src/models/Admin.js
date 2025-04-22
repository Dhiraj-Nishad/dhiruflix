const mongoose = require("mongoose"
)


const AdminUserSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String }
});


const AdminUser = mongoose.model("AdminUser", AdminUserSchema)


module.exports = AdminUser