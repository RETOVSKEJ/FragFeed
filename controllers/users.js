const User = require('../models/User')
const {
	getLikedPostsService,
	getLikedPostsPopulatedService,
	getDislikedPostsService,
} = require('../services/queries')
// const bcrypt = require('bcrypt')

async function getUsers(req, res) {
	return res.status(200).render('users')
}

async function getUser(req, res) {
	const user = await User.findOne({ nick: req.params.nick }).exec()
	if (!user) {
		res.status(400)
		throw new Error('Nie ma takiego usera')
	}

	const likedPosts = await getLikedPostsPopulatedService(user.likedPosts)

	return res.render('user', {
		user: user,
		msg: req.flash('logInfo'),
		likedPosts: likedPosts,
	})
}

async function getLikedPosts(req, res) {
	const posts = await getLikedPostsService(req.params._id)
	return res.json(posts)
}

async function getDislikedPosts(req, res) {
	const posts = await getDislikedPostsService(req.params._id)
	return res.json(posts)
}

module.exports = {
	getUsers,
	getUser,
	getLikedPosts,
	getDislikedPosts,
}
