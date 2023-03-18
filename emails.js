const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_KEY_API)

const message = {}
message.from = 'retovskej@wp.pl'

// wylaczenie wysylania emaili podczas develpomentu
message.mail_settings = {
	sandbox_mode: {
		enable: true,
	},
}

async function send(options) {
	Object.assign(message, {
		to: options.email,
		subject: options.subject,
		html: `<p>Witam witam oto testowy email!</p>`, // render pug
	})

	return await sgMail.send(message)
}

async function applicationNotify(options) {
	const defaultOptions = {
		subject: '[testBracket] witaj kawendziszu',
		view: 'application-notification',
	}

	console.log('Nowy uzytkownik zapisal sie do newslettera')

	return await send({ ...defaultOptions, ...options })
}

function render(filename, data) {
	return // pug render fle
}

module.exports = {
	applicationNotify,
}
