const path = require('path')
const fs = require('fs')

function createUpdateTXT(log) {
	if (!fs.existsSync(path.resolve('logs'))) {
		fs.mkdir(path.resolve('logs'), (err) =>
			console.error('Nie udalo sie stworzyc folderu logs')
		)
	}
	const logsPATH = path.resolve('logs/reqLog.txt')
	fs.appendFile(logsPATH, log, (err) => {
		console.assert(!err, err) // DEV
	})
}

function logEvents(req, res, next) {
	const dateTime = new Date().toLocaleString('pl', {
		dateStyle: 'short',
		timeStyle: 'long',
	})
	let log = `${dateTime}\t${req.get('referer')}\t${req.method} ${req.path}`
	// TODO w przyszlosci dodac req.get(user-agent) i req.ip

	if (log.match('.css|.html|.jpg|.png')) {
		log = `${log}\tSTATIC`
	}

	createUpdateTXT(`\n${log}`)

	console.log(log) // GET users/1234
	return next()
}

function logOtherEvents(otherLog) {
	const dateTime = new Date().toLocaleString('pl', {
		dateStyle: 'short',
		timeStyle: 'long',
	})
	const log = `\n${dateTime}\t${otherLog}`
	createUpdateTXT(log)

	console.log(log) // GET users/1234
}

module.exports = { logEvents, logOtherEvents }
