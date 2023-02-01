const mongoose = require('mongoose')

const testSchema = new mongoose.Schema({
    name: String,
    age: Number
})


module.exports = mongoose.model("Test", testSchema)

