const mongoose = require('mongoose')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = mongoose.Schema({
    nick: {
        type: String,
        minLength: [2, "This nick is too short"],
        maxLength: [30, "This nick is too long, max 30 characters"],
        unique: [true, "This nick is already taken"],
        required: [true, "you must provide nick"]
    },
    password:{
        type: String,
        minLength: [6, "This password is too short, please provide min. 6 characters"],
        required: [true, "you must provide password"]
    },
    email: {
        type: String,
        unique: [true, "This email is already taken"],
        required: [true, "you must provide email"],
        lowercase: true,
        validate: {
            validator: mail => emailRegex.test(mail),
            message: props => `${props.value} is not an valid email!`
        }
    }
},{
    timestamps: true
})

userSchema.statics.findByNick = function(nick){
    return this.where({nick: nick})
}
userSchema.statics.findByEmail = function(email){
    return this.where({email: email})
}


module.exports = mongoose.model('User', userSchema)