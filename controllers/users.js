const User = require('../models/User')
// const bcrypt = require('bcrypt')

async function getUsers(req, res) {
	return res.render('users')
}

async function getUser(req, res) {
	console.time()
	const user = await User.findOne({ nick: req.params.nick }).exec()
	if (!user) {
		res.status(400)
		throw new Error('Nie ma takiego usera')
	}
	console.timeEnd()
	return res.render('user', { user: user.nick })
}

/// /////// DELETE ALL USERS FROM DATABASE ///////////
// async function clearUsersDB() {
// 	const amount = await User.countDocuments()
// 	await User.deleteMany({})
// 	const left = await User.countDocuments()
// 	console.log(`DELETED ${amount - left} users`)
// }

module.exports = {
	getUsers,
	getUser,
}
