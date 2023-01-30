const mongoose = require('mongoose')
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (e) {
        console.error("ERROR MongoDB not Connected")
    }
}
 
// mongoose.connect(process.env.MONGO_URI,
//     () => console.log(`MongoDB connected ${host}`),
//     () => console.error(`MongoDB ERROR, not connected`)
// )



module.exports = connectDB