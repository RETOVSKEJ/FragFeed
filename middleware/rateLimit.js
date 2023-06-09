const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 25 * 1000, // 25 seconds
	max: 400,
	message: 'Zbyt dużo zapytań z tego adresu IP. Spróbuj ponownie za minutę.',
	standardHeaders: true,
	handler: (req, res) => {
		res.status(429)
		throw new Error(
			'Zbyt dużo zapytań z tego adresu IP. Spróbuj ponownie za minutę.'
		)
	},
})

const postingLimiter = rateLimit({
	windowMs: 240 * 1000, // 3 mins
	max: 5,
	message: 'Zbyt dużo zapytań z tego adresu IP. Spróbuj ponownie za minutę.',
	standardHeaders: true,
	handler: (req, res) => {
		res.status(429)
		throw new Error(
			'Zbyt dużo zapytań z tego adresu IP. Spróbuj ponownie za minutę.'
		)
	},
})

module.exports = { limiter, postingLimiter }
