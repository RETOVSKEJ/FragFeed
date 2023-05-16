const mongoose = require('mongoose')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const newsletterSchema = mongoose.Schema(
	{
		name: {
			type: String,
			minlength: [2, 'Twoja nazwa jest zbyt krótka'],
			maxlength: [
				40,
				'Twoja nazwa jest zbyt długa, maksymalnie 40 znaków',
			],
			required: [true, 'Nie podałeś nazwy'],
			trim: true,
		},
		email: {
			type: String,
			maxlength: [
				80,
				'Twój email jest zbyt długi, maksymalnie 80 znaków',
			],
			unique: true, // unique is not a VALIDATOR, no err message
			required: [true, 'Nie podałeś emaila'],
			lowercase: true,
			trim: true,
			validate: {
				validator: (mail) => emailRegex.test(mail),
				message: (props) => `${props.value} to nieprawidłowy email!`,
			},
		},
	},
	{
		timestamps: true, // tworzy createdAt i updatedAt
	}
)

module.exports = mongoose.model('Newsletter', newsletterSchema)
