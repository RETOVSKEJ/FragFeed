const Post = require('../models/Post')
const Newsletter = require('../models/Newsletter')
// const appMailer = require('../emails')
// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_KEY_API)
const {
	getPosts,
	getHotPosts,
	getAllLikedPostsService,
} = require('../services/queries')

/// ROUTES

async function getFetchPosts(req, res) {
	const bIsFetch = req.accepts('html') ? false : true
	const offset = bIsFetch ? parseInt(req.get('offset')) : null // TODO chyba mozna usunac nulla
	const fetchPostsLimit = parseInt(req.get('posts-count')) ?? null

	if (req.query.q === 'old') {
		var posts = await getPosts(fetchPostsLimit, {
			sort: 'createdAt',
			offset: offset,
		})
	} else {
		var posts = await getPosts(fetchPostsLimit, {
			sort: '-id',
			offset: offset,
		})
	}

	return res.status(200).json(posts)
}

async function getHome(req, res) {
	const preloadedPostsLimit = 8
	const bIsSearch = req.get('search') ? true : false

	const hotPosts = await getHotPosts()

	let posts, dislikedPosts, likedPosts
	;[likedPosts, dislikedPosts] = await getAllLikedPostsService(
		res.locals?.user
	)

	if (bIsSearch) {
		posts = await Post.find({ visible: true }).sort('-id').exec() // slight optimalization
		return res.vary('accept').status(200).send(posts)
	}

	req.session.post = null

	if (req.path === '/old') {
		posts = await getPosts(preloadedPostsLimit, {
			sort: 'createdAt',
		})
	} else {
		posts = await getPosts(preloadedPostsLimit, {
			sort: '-id',
		})
	}

	//	if(req.query === 'top')
	//	if(req.query === 'hot')
	res.vary('accept')
	return res.status(200).render('home', {
		dislikedPosts,
		likedPosts,
		hotPosts,
		posts,
		msg: req.flash('logInfo'),
	})
}

async function getHomePage(req, res) {
	const DEFAULT_LIMIT = 5 // ilosc blogPostow na stronę
	const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
	const page = parseInt(req.params.num) || 1
	const offset = limit * (page - 1)
	const postsPromise = getPosts(limit, { offset: offset })
	const countPromise = Post.countDocuments()
	const hotPostsPromise = getHotPosts()
	const [posts, postsCount, hotPosts] = await Promise.all([
		postsPromise,
		countPromise,
		hotPostsPromise,
	])

	// const numOfPages = Math.ceil(offset >= postsCount - limit)
	const numOfPages = Math.ceil(postsCount / limit)
	const bLastPage = page >= numOfPages ? true : false
	const bFirstPage = page === 1 ? true : false

	if (page > numOfPages)
		return res.redirect(`/page/${numOfPages}?limit=${limit}`)

	return res.status(200).render('homePage', {
		hotPosts,
		posts,
		page,
		limit,
		bLastPage,
		bFirstPage,
		msg: req.flash('logInfo'),
	})
}

async function postNewsletter(req, res) {
	const formData = {
		name: req.body.name,
		email: req.body.email.toLowerCase(),
	}

	// const msg = {
	// 	to: formData.email, // Adres e-mail odbiorcy
	// 	from: 'retovskej@wp.pl', // Adres e-mail nadawcy
	// 	subject: 'Temat emaila', // Temat wiadomości
	// 	text: 'witaj swecie!', // Treść wiadomości
	// 	html: '<strong>and easy to do anywhere, even with Node.js</strong>',
	// }

	// Wysłanie wiadomości e-mail
	// sgMail
	// 	.send(msg)
	// 	.then(() => {
	// 		console.log('Wiadomość e-mail została wysłana.')
	// 	})
	// 	.catch((error) => {
	// 		console.error(error)
	// 		res.status(500).json({
	// 			message: 'Wystąpił błąd podczas wysyłania wiadomości e-mail.',
	// 		})
	// 	})

	const succeed = await Newsletter.create(formData)

	// // send notifiaciton
	// await appMailer.applicationNotify({
	// 	email: formData.email,
	// 	data: { name: formData.name },
	// })
	if (succeed) req.flash('logInfo', 'Zostałeś dodany do newslettera!')
	if (!succeed) req.flash('logInfo', 'Coś poszło nie tak!')
	return res.status(200).redirect('/')
}

module.exports = {
	getFetchPosts,
	getHome,
	getHomePage,
	postNewsletter,
}
