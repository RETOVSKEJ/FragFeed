const express = require('express')

const router = express.Router()
const passport = require('passport')

// todo getLogin etc.
const ROLES = require('../models/roles')
const { catchAsync } = require('../middleware/errors')
const {
	getLogin,
	postLoginRememberMe,
	getRegister,
	postRegister,
	logOut,
} = require('../controllers/auth')
const {
	authUser,
	notAuthUser,
	authRoles,
} = require('../middleware/permissions')

router
	.route('/login')
	.get(notAuthUser, catchAsync(getLogin))
	.post(
		notAuthUser,
		passport.authenticate('local', {
			failureRedirect: '/login',
			badRequestMessage: 'Wrong Request / missing credentials', // wyswietli sie nad errorem
			failureFlash: true,
		}),
		postLoginRememberMe
	)

router.delete('/logout', authUser, logOut)

router
	.route('/register')
	.get(notAuthUser, catchAsync(getRegister))
	.post(notAuthUser, catchAsync(postRegister))

module.exports = router
