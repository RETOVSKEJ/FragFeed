const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


//done(srvError, foundUser, {passObj})
function initialize(passport, getUserByNick)
{
    const authenticateUser = async(nick, password, done) => {
        const user = await getUserByNick(nick)
        if(user == null){       // TODO check user == null or !user
            return done(null, false, "No user with that nick")
        }

        try{
            if(await bcrypt.compare(password, user.password))
                return done(null, user, { message: "Logged in succesfully"})  // TODO view messages on frontend
            else
                return done(null, false, { message : "wrong password" })
        } catch (err) {
            return done(err)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'nick'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.nick))
    passport.deserializeUser((nick, done) => done(null, getUserByNick(nick)))
}

module.exports = initialize