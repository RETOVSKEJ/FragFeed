const bcrypt = require('bcrypt')
const User = require('../models/User')

const MIN_PASSWORD_LENGTH = 5

async function getLogin(req, res) {
	if (global.location === 'logout') {
		delete global.location
		req.flash('logInfo', 'Wylogowałeś się pomyślnie')
	}

	return res.render('login', { msg: req.flash('logInfo') })
}

async function postLoginRememberMe(req, res) {
	req.flash('logInfo', 'Zalogowano poprawnie')
	req.body.remember_me
		? (req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30) // remember me checked 30 days
		: (req.session.cookie.maxAge = null) // remember me unchecked
	return res.redirect('/')
}

async function getRegister(req, res) {
	return res.render('register', { msg: req.flash('logInfo') })
}

async function postRegister(req, res, next) {
	const { nick, password, conf_password, email } = req.body

	if (password !== conf_password) {
		req.flash('logInfo', 'Hasła nie są takie same')
		res.status(400)
		return res.redirect('/register')
	}

	if (password.length < MIN_PASSWORD_LENGTH) {
		req.flash('logInfo', 'To haslo jest za krotkie, min. 5 znakow')
		res.status(400)
		return res.redirect('/register')
	}

	// if(password.length < MIN_PASSWORD_LENGTH)
	// {
	//     req.flash('error', 'To haslo jest za krotkie, min. 5 znakow')
	//     res.status(400); throw new Error('This password is too short')
	// }

	const salt = await bcrypt.genSalt(10)
	const hashedPwd = await bcrypt.hash(password, salt)

	const user = await User.create({
		nick,
		password: hashedPwd,
		email,
	})

	req.flash('logInfo', 'Zarejestrowano pomyślnie')
	return res.redirect('/login')
}

async function logOut(req, res, next) {
	req.logOut((err) => (err ? next(err) : void 0))
	global.location = 'logout'
	return res.redirect('/login')
}

module.exports = {
	getLogin,
	postLoginRememberMe,
	getRegister,
	postRegister,
	logOut,
}
