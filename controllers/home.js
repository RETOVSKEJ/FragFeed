const Post = require('../models/Post')

// async function getPostsComponent(){
//     return await Post.find({}).exec()               // get ALL posts in the post array
// }

async function getHomepage(req, res){
    const posts = await Post.find({}).populate('author', '-password').exec()
    res.status(200).render('homePage', {posts: posts, msg: req.flash('logInfo')})
}

module.exports = {
    getHomepage
}