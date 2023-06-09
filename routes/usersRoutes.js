const express = require('express')

const router = express.Router()

const ROLES = require('../models/roles')
const { catchAsync } = require('../middleware/errors')
const {
	getUsers,
	getUser,
	getLikedPosts,
	getDislikedPosts,
	postUser,
	deleteUser,
	updateUser,
} = require('../controllers/users')
const { authUser, notAuthUser } = require('../middleware/permissions')

// TEMPORARILY OFF
// router.route('/').get(catchAsync(getUsers)).post(authUser, catchAsync(postUser))

router
	.route('/:nick')
	.get(catchAsync(getUser))
	.delete(authUser, catchAsync(deleteUser))
	.patch(authUser, catchAsync(updateUser))

router.route('/:_id/liked-posts').get(authUser, catchAsync(getLikedPosts))
router.route('/:_id/disliked-posts').get(authUser, catchAsync(getDislikedPosts))

module.exports = router
