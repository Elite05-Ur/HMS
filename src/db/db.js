const mongoose = require('mongoose')

async function ConnectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected Successfully!")
    } catch (error) {
        console.log("DB Connection Error:", error)
    }
}

module.exports = ConnectDB