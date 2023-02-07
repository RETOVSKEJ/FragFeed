const Post = require('../models/Post')

///////////// GET ////////////////


// @route /:id
async function getPost(req, res){
    // if(isNaN(req.params.id)) {res.status(400); throw new Error('Nie istnieje taki post, podaj numer')} 
    const post = await Post.findOne({id: req.params.id})
    .populate('author', '-password')
    .populate('edited_by', '-password').exec()
    post.createdAtString = post.createdAt.toLocaleString('pl', {dateStyle: 'long', timeStyle: 'short'})   // local variable for templates
    post.updatedAtString = post.updatedAt.toLocaleString('pl', {dateStyle: 'long', timeStyle: 'short'})   // local variable for templates
    req.session.post = post
    if(!post) {res.status(400); throw new Error('Nie istnieje taki post')}
    return res.status(200).render('post', { post: post, msg: req.flash('logInfo')})
}

// @route /new
async function getPostForm(req, res){
    return res.status(200).render('newPost', { msg: req.flash('logInfo')})
}

//@route /:id/edit
async function getEditForm(req, res){
    const post = await Post.findOne({id: req.params.id})
    .populate('author', '-password')                            // TODO SPRAWDZIC TUTAJ POPULATE CZY NIE LEPIEJ JEST USUWAC -_id i porownywac w permissions samo .author z req.user._id, (Zamiast .author._id)
    .populate('edited_by', '-password').exec()
    req.session.post = post
    return res.status(200).render('editPost', { post: post, msg: req.flash('logInfo')})
}
///////////// POST ////////////////


// @route /
async function postPost(req, res){
    const LAST_ID = (await Post.findOne().sort('-id'))?.id ?? 0 // przypisuje id 0 jesli zaden post nie istnieje // Lepsze od countDocuments, bo nie zmienia ID w przypadku usuniecia
    const post = await Post.create({
        id: LAST_ID + 1,
        title: req.body.title,
        body: req.body.body,
        author: req.user
    }) 

    console.log("POSTED")
    res.status(201);
    return res.redirect(`/${post.id}`)
}

///////////// PUT PATCH DELETE ////////////////

// @route /:id/edit    PATCH
async function editPost(req, res){
    await Post.updateOne({id: req.params.id}, {
        title: req.body.title,
        body: req.body.body,
        edited_by: req.user
    })
    req.flash('logInfo', 'Edited Succesfully')
    return res.redirect(`/${req.params.id}`)
}

// @route /:id
async function deletePost(req, res){
    const post = await Post.findOneAndDelete({id: req.params.id}).exec() 
    if (!post) 
        throw new Error("Nie ma posta o takim ID!")
    else {
        req.flash('logInfo', 'usunieto post:', post.title)
        console.log("usunieto post o id: ", post.id)
    }
    return res.redirect(`/`)
}

module.exports = {
    getPost,
    getPostForm,
    getEditForm,
    postPost,
    editPost,
    deletePost
}