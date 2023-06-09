const LocalStrategy = require('passport-local').Strategy
// const RememberMeStrategy = require('passport-remember-me').Strategy
const bcrypt = require('bcrypt')

// done(srvError, foundUser, {passObj})
function initialize(passport, getUserByNick) {
	const authenticateUser = async (nick, password, done) => {
		const user = await getUserByNick(nick)
		if (user == null) {
			return done(null, false, 'Nie ma takiego użytkownika')
		}

		try {
			if (await bcrypt.compare(password, user.password)) {
				return done(null, user, 'Zalogowano poprawnie!')
			}
			return done(null, false, 'Nieprawidłowe Hasło')
		} catch (err) {
			return done(err)
		}
	}

	passport.use(new LocalStrategy({ usernameField: 'nick' }, authenticateUser))

	// passport.use(new RememberMeStrategy(
	//     (token, done) => { Token.consume(token,
	//         (err, user) => {
	//             if (err)  return done(err);
	//             if (!user)  return done(null, false);
	//             return done(null, user);
	//         });
	//         },
	//     (user, done) => {
	//           const token = utils.generateToken(64);
	//           Token.save(token, { userId: user.id },
	//             (err)=> {
	//                 if (err) return done(err);
	//                 return done(null, token);
	//           });
	//         }
	//       ));

	passport.serializeUser((user, done) => done(null, user.nick))
	passport.deserializeUser(async (nick, done) =>
		done(null, await getUserByNick(nick))
	)
}

module.exports = initialize
