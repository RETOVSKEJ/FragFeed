const Post = require('../models/Post')

// async function getPostsComponent(){
//     return await Post.find({}).exec()               // get ALL posts in the post array
// }

async function getHomepage(req, res) {
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
	res.status(200).render('homePage', { posts, msg: req.flash('logInfo') })
}

module.exports = {
	getHomepage,
}
