const mongoose = require("mongoose")



const MoviesSchema = new mongoose.Schema({
    movieName: { type: String, unique: true },
    movieUrl: { type: String, unique: true },
    movieImage: { type: String, unique: true },
    category: { type: String },
    year: { type: Number }
}, { timestamps: true })



const Movies = mongoose.model("Movies", MoviesSchema)

module.exports = Movies