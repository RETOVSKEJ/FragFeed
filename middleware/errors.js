const path = require('path')
const { logOtherEvents } = require('./logEvents')

// if (res.headersSent) {
//     return next(err)
// }
// @ desc error handler musi miec 4 argumenty, inaczej nie bedzie dzialac
function errorHandler(err, req, res, next) {
	console.error(res.statusCode)
	console.error(err.stack)
	const errorLog = `${res.statusCode}\t${err.name}`

	logOtherEvents(errorLog)

	/// //// LOGIN REGISTER INPUTS //////////////
	if (err.name == 'ValidationError') {
		// console.log(err.errors.author.properties, "\n", err.errors.author)
		let type
		for (const i in err.errors) {
			try {
				type = i
				const { message } = err.errors[type].properties
				req.flash('logInfo', `${message}`)
			} catch (err) {
				console.error(err)
			}
		}

		console.info('Refreshing back after register mistake...')
		return res.redirect('back')
	}

	if (err.name === 'MongoServerError' && err.code === 11000) {
		if (err.keyValue.email) {
			req.flash('logInfo', 'This email is already taken')
		}
		if (err.keyValue.nick) {
			req.flash('logInfo', 'This nick is already taken')
		}
		return res.redirect('back')
	}
	if (err.name == 'MongoServerError') {
		return res.render('500')
	}

	/// /// ROLES /////

	if (err.message === 401 || res.statusCode === 401) {
		req.flash('logInfo', 'You must log in') // TODO popUp message instead of flash
		return res.redirect('/login')
	}

	if (err.message === 403 || res.statusCode === 403) {
		req.flash('logInfo', 'You are not allowed') // TODO popUp message instead of flash
		return res.redirect('back')
	}

	/// ///// STATIC FILES //////////////

	if (req.path.match('.css|.html|.jpg|.png')) {
		// TODO DO PRZENIESIENIA DO LOGEVENTS
		console.error(`NIE UDALO SIE WCZYTAC PLIKU STATYCZNEGO ${req.path}`)
	}

	/// //// DEFAULT HANDLERS ////////////
	if (err.message == 400 || res.statusCode == 400) {
		return res.render('400', { err })
	} // DEV - domyslnie modal popup

	if (err.message == 404 || res.statusCode == 404) {
		if (req.accepts('html')) {
			return res.sendFile(path.resolve('public/404.html'))
		}
		return res.json({ error: '404 json' })
	}

	return res.status(500).sendFile(path.resolve('public/error.html')) // resolve to join, ale zwraca ABSOLUTE path do glownej sciezki projektu
}

// wrapper ktory dodajemy przed kazda async funkcja w routach.
function catchAsync(fn) {
	// wylapuje wszystkie SYNTAX I THROW ERRORY PRZY KOMPILACJI
	return (req, res, next) => {
		fn(req, res, next).catch((err, req) => next(err, req)) // next(err), wywola mi kolejny middleware, czyli error handler, ktoremu przekaze error
	}
}

module.exports = {
	errorHandler,
	catchAsync,
}
