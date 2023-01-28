const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')



function initialize(passport, getUserByNick)
{
    const authenticateUser = async (nick, password, done) => {
        const user = await getUserByNick(nick)
        
    }







    passport.use(new LocalStrategy({usernameField: 'nick'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.nick))
    passport.deserializeUser((nick, done) => done(null, getUserByNick(nick)))
    
}

module.exports = initialize