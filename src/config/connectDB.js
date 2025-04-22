const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()


const connectDB = mongoose.connect(process.env.MONGODB).then(() => console.log("MongoDb is Connected")
).catch((error) => console.log(error)
)


module.exports = connectDB