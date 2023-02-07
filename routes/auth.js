const express = require('express')
const router = express.Router()
const passport = require('passport')

// todo getLogin etc.
const ROLES = require('../models/roles')
const { catchAsync } = require('../middleware/errors') 
const { getLogin, getRegister, postRegister, logOut } = require('../controllers/auth')
const { authUser, notAuthUser, authRoles } = require('../middleware/permissions')

router.route('/login')
.get(notAuthUser, catchAsync(getLogin))
.post(notAuthUser, passport.authenticate('local', {
    failureRedirect: '/login',
    badRequestMessage: 'Wrong Request / missing credentials',  // wyswietli sie nad errorem
    failureFlash: true 
}), rememberMe)

router.delete('/logout', authUser, logOut)

router.route('/register')
.get(notAuthUser, catchAsync(getRegister))
.post(notAuthUser, catchAsync(postRegister))


module.exports = router

function rememberMe(req, res)
{
    (req.body.remember_me)
      ? req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30 // remember me checked 30 days
      : req.session.cookie.maxAge = null                    // remember me unchecked
    return res.redirect('/')
}