const Post = require('../models/Post')

/// HELPERS

async function retrieveAllPosts(query) {
	const regex = new RegExp(query)
	const posts = await Post.find({
		$or: [{ title: { $regex: regex } }, { body: { $regex: regex } }],
	})
		.sort('-id')
		.populate('author', '-password')
		.exec()
	return posts
}

async function retrievePosts(
	postsCount = null,
	{ sort = null, offset = null, objQuery = null }
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

async function getHome(req, res) {
	const preloadedPostsLimit = 8
	const bIsFetch = req.accepts('html') ? false : true
	const bIsSearch = req.get('data') ? true : false
	const offset = bIsFetch ? parseInt(req.get('offset')) : null // TODO chyba mozna usunac nulla
	const fetchPostsLimit = bIsFetch ? parseInt(req.get('posts-count')) : null
	let posts

	req.session.post = null
	console.log(req.headers)

	if (bIsSearch) {
		posts = await retrieveAllPosts(req.get('data'))
		return res.send(posts)
	}

	if (req.path === '/old') {
		bIsFetch
			? (posts = await retrievePosts(fetchPostsLimit, {
					offset: offset,
			  }))
			: (posts = await retrievePosts(preloadedPostsLimit))
	} else {
		bIsFetch
			? (posts = await retrievePosts(fetchPostsLimit, {
					sort: '-id',
					offset: offset,
			  }))
			: (posts = await retrievePosts(preloadedPostsLimit, {
					sort: '-id',
			  }))
	}
	//	if(req.query === 'top')
	//	if(req.query === 'hot')

	res.vary('accept')
	return req.accepts('html')
		? res.status(200).render('home', { posts, msg: req.flash('logInfo') })
		: res.send(posts)
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

module.exports = {
	getHome,
	getHomePage,
}
