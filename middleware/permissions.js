const ROLES = require('../models/roles')
const Post = require('../models/Post')

function authUser(req, res, next) {
	if (req.isAuthenticated()) {
		res.locals.user = req.user
		return next()
	}

	res.status(401)
	throw new Error('You are not authorized')
}

function notAuthUser(req, res, next) {
	if (!req.isAuthenticated()) {
		return next()
	}

	res.status(403)
	throw new Error('You are not allowed')
}

/// OGOLNA FUNKCJA DO SPRAWDZANIA ROLI UZYTKOWNIKA
function authRoles(role) {
	return (req, res, next) => {
		console.log(req.user)

		if (req.user.role === role) {
			return next()
		}

		res.status(403)
		throw new Error(403)
	}
}

// @route /:id
async function canAddPost(req, res, next) {
	if (req.user.role === ROLES.ADMIN || req.user.role === ROLES.VIP) {
		return next()
	}

	res.status(403)
	throw new Error('You are not allowed to add posts')
}

// @route /:id
async function canEditPost(req, res, next) {
	if (req.session.post?.id != req.params.id) {
		// ZABEZPIECZENIE przed wpisaniem bezpośrednio url /:id/edit if the post is not in the session, get it from the db
		req.session.post = await Post.findOne({ id: req.params.id })
			.populate('author', '-password')
			.exec()
	}

	if (
		req.user.role === ROLES.ADMIN ||
		req.session.post?.author?._id === req.user._id.toString()
	) {
		return next()
	}

	console.log(req.session)
	console.log(req.session.post?.author?._id, req.user._id.toString())
	res.status(403)
	throw new Error('You are not allowed to edit this post')
}

async function canDeletePost(req, res, next) {
	if (req.session.post.id != req.params.id) {
		// if the post is not in the session, get it from the db
		req.session.post = await Post.findOne({ id: req.params.id })
			.populate('author', '-password')
			.exec()
	}

	if (
		req.user.role === ROLES.ADMIN ||
		req.session.post?.author?._id === req.user._id.toString()
	) {
		return next()
	}

	res.status(403)
	throw new Error('You are not allowed to delete this post')
}

// @route /
async function canLikePost(req, res, next) {
	if (req.user) {
		return next()
	}

	res.status(403)
	throw new Error('You are not allowed to edit this post')
}

async function canCommentPost(req, res, next) {
	if (req.user) {
		return next()
	}

	res.status(403)
	throw new Error('You are not allowed to comment this post')
}

module.exports = {
	authUser,
	notAuthUser,
	authRoles,
	canAddPost,
	canEditPost,
	canDeletePost,
	canLikePost,
	canCommentPost,
}
