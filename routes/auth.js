const express = require('express')
const router = express.Router()
const passport = require('passport')

// todo getLogin etc.
const { catchAsync } = require('../middleware/errors') 
const { getLogin, getRegister, postRegister } = require('../controllers/auth')

router.route('/login').get(catchAsync(getLogin))
.post(passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    badRequestMessage: 'Wrong Request / missing credentials',  // wyswietli sie nad errorem
    failureFlash: true
}))
router.route('/register').get(catchAsync(getRegister)).post(catchAsync(postRegister))

module.exports = router