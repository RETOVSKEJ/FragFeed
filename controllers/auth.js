const User = require('../models/User')
const bcrypt = require('bcrypt')

const MIN_PASSWORD_LENGTH = 5


async function getLogin(req, res){
    if(global.location === 'logout'){
        delete global.location;
        req.flash('logInfo', 'You have logged out Succesfully')
    }

    res.render('login', { msg: req.flash('logInfo') })
}

async function getRegister(req, res){
    res.render('register', { msg: req.flash('error')})
}

async function postRegister(req, res, next){
    const {nick, password, conf_password, email} = req.body
    console.time()
    console.log(req.body)

    if(password !== conf_password){
        req.flash('error', 'Hasła nie są takie same')
        res.status(400);
        return res.redirect('/register')
    }

    if(password.length < MIN_PASSWORD_LENGTH)
    {
        req.flash('error', 'To haslo jest za krotkie, min. 5 znakow')
        res.status(400);
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
        email
    })

    console.timeEnd()
    req.flash('logInfo', 'Registered successfully')
    res.redirect(`/login`)   
}

async function logOut(req, res){
    req.logOut(err => err ? next(err) : void(0))
    global.location = 'logout'
    return res.redirect('/login')
}

function checkAuthenticated(req,res,next){
    console.info("checking if auth")
    if(req.isAuthenticated())
        return next();
    else
        return res.redirect('/login')
}
function checkNotAuthenticated(req,res,next){
    console.info("checking if not auth")
    if(!req.isAuthenticated())
        return next();
    else
        return res.redirect('/')
}


module.exports = {
    getLogin,
    getRegister,
    postRegister,
    logOut,
    checkAuthenticated,
    checkNotAuthenticated
}