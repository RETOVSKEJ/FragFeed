const Post = require('../models/Post')

// async function getPostsComponent(){
//     return await Post.find({}).exec()               // get ALL posts in the post array
// }

async function getHome(req, res) {
	console.log('elo')
	if (req.path === '/old') {
		var posts = await Post.find({})
			.populate('author', '-password')
			.populate('edited_by', '-password')
			.exec()
	} else {
		var posts = await Post.find({})
			.sort('-id')
			.populate('author', '-password')
			.populate('edited_by', '-password')
			.exec()
	}
	//	if(req.query === 'top')
	//	if(req.query === 'hot')
	req.session.post = null
	return res.status(200).render('home', { posts, msg: req.flash('logInfo') })
}

async function getHomePage(req, res) {
	const DEFAULT_LIMIT = 5 // ilosc blogPostow na stronę
	const limit = parseInt(req.query.limit) || DEFAULT_LIMIT
	const page = parseInt(req.params.num) || 1
	const offset = limit * (page - 1)
	const postsPromise = Post.find({})
		.sort('-id')
		.skip(offset)
		.limit(limit)
		.populate('author', '-password')
		.populate('edited_by', '-password')
		.exec()
	const countPromise = Post.countDocuments()
	const [posts, postsCount] = await Promise.all([postsPromise, countPromise])

	// const numOfPages = Math.ceil(offset >= postsCount - limit)
	const numOfPages = Math.ceil(postsCount / limit)
	const bLastPage = page >= numOfPages ? true : false
	const bFirstPage = page === 1 ? true : false

	if (page > numOfPages)
		return res.redirect(`/page/${numOfPages}?limit=${limit}`)

	return res
		.status(200)
		.render('homePage', {
			posts,
			page,
			limit,
			bLastPage,
			bFirstPage,
			msg: req.flash('logInfo'),
		})
}

module.exports = {
	getHome,
	getHomePage,
}
