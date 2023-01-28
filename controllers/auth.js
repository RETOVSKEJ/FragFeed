const User = require('../models/User')
const bcrypt = require('bcrypt')
const { findById } = require('../models/User')

function getLogin(req, res){
    res.render('login', { msg: req.flash('logInfo') })
}
// function postLogin(passport){
    
//     req.flash('logInfo', 'Logged in successfully')
//     res.redirect('/')
// }


function getRegister(req, res){
    res.render('register', { msg: req.flash('error')})
}

async function postRegister(req, res, next){
    const {nick, password, email} = req.body
    
    console.time()

    // if(await User.findByNick(nick).length != 0)
    // {
    //     console.log('zajety nick')
    //     req.flash('error', 'ten nick jest zajety')
    //     res.redirect('/register')
    // }

    // if(await User.findByEmail(email).length != 0)
    // {
    //     console.log('zajety email')
    //     req.flash('error', 'ten nick jest zajety')
    //     res.redirect('/register')
    // }


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