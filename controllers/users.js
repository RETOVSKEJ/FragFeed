const User = require('../models/User')
const bcrypt = require('bcrypt')

async function getUsers(req, res){
    res.render('users')
}

async function getUser(req, res){
    console.time()
    const user = await User.findOne({nickname: req.params.nickname}).exec()
    if(!user) { res.status(400); throw new Error('Nie ma takiego usera')}
    console.timeEnd()
    res.render('user', { user: user.nickname })
}

async function postUser(req, res, next){
    const {nickname, password, email} = req.body
    console.time()
    const salt = await bcrypt.genSalt(10)
    const hashedPwd = await bcrypt.hash(password, salt)

    const user = await User.create({
        nickname,
        password: hashedPwd,
        email
    })
    // user.then(() => console.log("sukces")).catch((err) => console.error(err.message))
    console.timeEnd()

    res.status(201).redirect(`users/${nickname}`)
}

module.exports = {
    getUsers,
    getUser,
    postUser
}