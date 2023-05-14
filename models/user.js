const mongoose = require('mongoose')
const ROLES = require('./roles')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const userSchema = mongoose.Schema(
	{
		nick: {
			type: String,
			minlength: [2, 'This nick is too short'],
			maxlength: [30, 'This nick is too long, max 30 characters'],
			trim: true,
			unique: true, // unique is not a VALIDATOR, no err message
			required: [true, 'you must provide nick'],
		},
		password: {
			type: String,
			minlength: [
				6,
				'This password is too short, please provide min. 6 characters',
			], // nie dziala bo jest hashowane przed
			required: [true, 'you must provide password'],
		},
		email: {
			type: String,
			unique: true, // unique is not a VALIDATOR, no err message
			required: [true, 'you must provide email'],
			lowercase: true,
			trim: true,
			validate: {
				validator: (mail) => emailRegex.test(mail),
				message: (props) => `${props.value} is not an valid email!`,
			},
		},
		role: {
			type: String,
			enum: ROLES,
			default: ROLES.USER,
		},
		likedPosts: {
			type: [Number],
			trim: true,
			default: [],
		},
		dislikedPosts: {
			type: [Number],
			trim: true,
			default: [],
		},
	},
	{
		timestamps: true,
	}
)

// userSchema.post('save', function(error, doc, next){
//     if(error.name === 'MongoServerError' && error.code === 11000){
//         if(!!error.keyValue['email'])
//             next(new Error('duplicate email'))
//         else if(!!error.keyValue['nick'])
//             next(new Error('duplicate nick'))
//     }
//     else
//         next()
// })

// userSchema.post('update', function(error, doc, next){
//     if(error.name === 'MongoServerError' && error.code === 11000){
//         if(!!error.keyValue['email'])
//             next(new Error('duplicate email'))
//         else if(!!error.keyValue['nick'])
//             next(new Error('duplicate nick'))
//     }
//     else
//         next()
// })

userSchema.statics.findByNick = async function (nick) {
	return this.findOne({ nick }).exec() // bez await
}

userSchema.statics.nickExists = async function (nick) {
	return this.exists({ nick })
}
userSchema.statics.findByEmail = async function (email) {
	return this.exists({ email })
}

module.exports = mongoose.model('User', userSchema)
