const User = require('../models/User')
const bcrypt = require('bcrypt')

const MIN_PASSWORD_LENGTH = 5

async function getLogin(req, res){
    res.render('login', { msg: req.flash('logInfo') })
}
// function postLogin(passport){
    
//     req.flash('logInfo', 'Logged in successfully')
//     res.redirect('/')
// }


async function getRegister(req, res){
    res.render('register', { msg: req.flash('error')})
}

async function postRegister(req, res, next){
    const {nick, password, email} = req.body
    console.time()

    if(await User.findByNick(nick))
    {
        req.flash('error', 'ten nick jest zajety')
        return res.redirect('/register')
    }

    if(await User.findByEmail(email))
    {
        console.error('zajety email')
        req.flash('error', 'ten email jest zajety')
        return res.redirect('/register')
    }

    if(password.length < MIN_PASSWORD_LENGTH)
    {
        console.error('zbyt krotkie haslo')
        req.flash('error', 'To haslo jest za krotkie, min. 5 znakow')
        return res.redirect('/register')
    }


    const salt = await bcrypt.genSalt(10)
    const hashedPwd = await bcrypt.hash(password, salt)

    const user = await User.create({
        nick,
        password: hashedPwd,
        email
    })
    // user.then(() => console.log("sukces")).catch((err) => console.error(err.message))
    console.timeEnd()
    req.flash('logInfo', 'Registered successfully')
    res.status(201).redirect(`/login`)   
}




module.exports = {
    getLogin,
    getRegister,
    postRegister
}