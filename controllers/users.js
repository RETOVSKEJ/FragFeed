const User = require('../models/User')
// const bcrypt = require('bcrypt')

async function getUsers(req, res){
    res.render('users')
}

async function getUser(req, res){
    console.time()
    const user = await User.findOne({nick: req.params.nick}).exec()
    if(!user) { res.status(400); throw new Error('Nie ma takiego usera')}
    console.timeEnd()
    res.render('user', { user: user.nick })
}


module.exports = {
    getUsers,
    getUser
}