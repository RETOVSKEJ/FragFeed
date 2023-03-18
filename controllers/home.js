const Post = require('../models/Post')
const appMailer = require('../emails')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_KEY_API)

/// HELPERS

async function retrieveAllPosts(query) {
	const regex = new RegExp(query)
	const posts = await Post.find({
		$or: [{ title: { $regex: regex } }, { body: { $regex: regex } }],
	})
		.sort('-id')
		.populate('author', '-password')
		.populate('edited_by', '-password')
		.exec()
	return posts
}

async function retrievePosts(
	postsCount = null,
	{ sort = 'asc', offset = null, objQuery = null }
) {
	return await Post.find({ objQuery })
		.limit(postsCount)
		.sort(sort)
		.skip(offset)
		.populate('author', '-password')
		.populate('edited_by', '-password')
		.exec()
}

/// ROUTES

async function getFetchPosts(req, res) {
	const bIsFetch = req.accepts('html') ? false : true
	const offset = bIsFetch ? parseInt(req.get('offset')) : null // TODO chyba mozna usunac nulla
	const fetchPostsLimit = parseInt(req.get('posts-count')) ?? null

	if (req.path === '/old') {
		var posts = await retrievePosts(fetchPostsLimit, {
			offset: offset,
		})
	} else {
		var posts = await retrievePosts(fetchPostsLimit, {
			sort: '-id',
			offset: offset,
		})
	}

	return res.status(200).json(posts)
}

async function getHome(req, res) {
	const preloadedPostsLimit = 8
	const bIsSearch = req.get('search') ? true : false

	let posts
	console.log(req.headers)

	if (bIsSearch) {
		posts = await Post.find().sort('-id').exec() // slight optimalization
		return res.vary('accept').status(200).send(posts)
	}

	req.session.post = null

	if (req.path === '/old') {
		posts = await retrievePosts(preloadedPostsLimit)
	} else {
		posts = await retrievePosts(preloadedPostsLimit, {
			sort: '-id',
		})
	}
	//	if(req.query === 'top')
	//	if(req.query === 'hot')
	res.vary('accept')
	return res.status(200).render('home', { posts, msg: req.flash('logInfo') })
}

async function getHomePage(req, res) {
	const DEFAULT_LIMIT = 5 // ilosc blogPostow na stronę
	const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
	const page = parseInt(req.params.num) || 1
	const offset = limit * (page - 1)
	const postsPromise = retrievePosts(limit, { offset: offset })
	const countPromise = Post.countDocuments()
	const [posts, postsCount] = await Promise.all([postsPromise, countPromise])

	// const numOfPages = Math.ceil(offset >= postsCount - limit)
	const numOfPages = Math.ceil(postsCount / limit)
	const bLastPage = page >= numOfPages ? true : false
	const bFirstPage = page === 1 ? true : false

	if (page > numOfPages)
		return res.redirect(`/page/${numOfPages}?limit=${limit}`)

	return res.status(200).render('homePage', {
		posts,
		page,
		limit,
		bLastPage,
		bFirstPage,
		msg: req.flash('logInfo'),
	})
}

async function getSearchResults(req, res) {
	const results = await retrieveAllPosts(req.query.q)

	console.log(results)
	return res.status(200).render('search', {
		posts: results,
		postsCount: results.length,
		msg: req.flash('logInfo'),
	})
}

async function postNewsletter(req, res) {
	console.log(req.body)

	const formData = {
		name: req.body.name,
		email: req.body.email.toLowerCase(),
	}

	const msg = {
		to: formData.email, // Adres e-mail odbiorcy
		from: 'retovskej@wp.pl', // Adres e-mail nadawcy
		subject: 'Temat emaila', // Temat wiadomości
		text: 'witaj siwecie!', // Treść wiadomości w formacie tekstowym
		html: '<strong>and easy to do anywhere, even with Node.js</strong>',
	}

	// Wysłanie wiadomości e-mail
	sgMail
		.send(msg)
		.then(() => {
			console.log('Wiadomość e-mail została wysłana.')
		})
		.catch((error) => {
			console.error(error)
			res.status(500).json({
				message: 'Wystąpił błąd podczas wysyłania wiadomości e-mail.',
			})
		})

	// console.log(formData)
	// // store in DB

	// // send notifiaciton
	// await appMailer.applicationNotify({
	// 	email: formData.email,
	// 	data: { name: formData.name },
	// })

	req.flash('logInfo', 'Dziekujemy za zapisanie do newslettera!')
	return res.status(200).redirect('/')
}

module.exports = {
	getFetchPosts,
	getHome,
	getHomePage,
	getSearchResults,
	postNewsletter,
}
