require('dotenv').config()
const app = require('./src/app')
const ConnectDB = require('./src/db/db')

const PORT = process.env.PORT || 3000

// First Connect DB, then Start Server
ConnectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`HMS Server running smoothly at Port ${PORT}`)
    })
}).catch((err) => {
    console.log("Failed to connect DB:", err)
})