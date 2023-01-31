const express = require('express')
const router = express.Router()
const passport = require('passport')

// todo getLogin etc.
const { catchAsync } = require('../middleware/errors') 
const { getLogin, getRegister, postRegister, logOut, checkAuthenticated, checkNotAuthenticated } = require('../controllers/auth')

router.route('/login')
.get(checkNotAuthenticated, catchAsync(getLogin))
.post(checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    badRequestMessage: 'Wrong Request / missing credentials',  // wyswietli sie nad errorem
    failureFlash: true
}))

router.delete('/logout', checkAuthenticated, logOut)

router.route('/register')
.get(checkNotAuthenticated, catchAsync(getRegister))
.post(checkNotAuthenticated, catchAsync(postRegister))



module.exports = router