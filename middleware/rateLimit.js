const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 30 * 1000, // 15 seconds
	max: 420,
	message: 'Zbyt dużo zapytań z tego adresu IP. Spróbuj ponownie za minutę.',
	standardHeaders: true,
	handler: (req, res) => {
		res.status(429)
		throw new Error(
			'Zbyt dużo zapytań z tego adresu IP. Spróbuj ponownie za minutę.'
		)
	},
})

module.exports = limiter
