const Post = require('../models/Post')
const Joi = require('joi');
const { storeImage } = require('../middleware/imageHandler')
const fs = require('fs')
const path = require('path')
///////////// GET ////////////////


// @route /:id
async function getPost(req, res){
    const post = await Post.findOne({id: req.params.id})
    .populate('author', '-password')
    .populate('edited_by', '-password').exec()
    post.createdAtString = post.createdAt.toLocaleString('pl', {dateStyle: 'long', timeStyle: 'short'})   // local variable for templates
    post.updatedAtString = post.updatedAt.toLocaleString('pl', {dateStyle: 'long', timeStyle: 'short'})   // local variable for templates
    req.session.post = post
    req.session.preview = null;
    if(!post) {res.status(400); throw new Error('Nie istnieje taki post')}
    console.log(post)
    return res.status(200).render('post', { post: post, msg: req.flash('logInfo')})
}

// @route /new
async function getPostForm(req, res){
    req.session.preview = null;
    return res.status(200).render('postForm', { msg: req.flash('logInfo')})
}

//@route /:id/edit
async function getEditForm(req, res){
    const post = await Post.findOne({id: req.params.id})
    .populate('author', '-password')                            // TODO SPRAWDZIC TUTAJ POPULATE CZY NIE LEPIEJ JEST USUWAC -_id i porownywac w permissions samo .author z req.user._id, (Zamiast .author._id)
    .populate('edited_by', '-password').exec()
    req.session.post = post
    req.session.preview = null
    return res.status(200).render('postForm', { post: post, msg: req.flash('logInfo')})
}


/////////// PREVIEW FUNC ////////////

//@route /preview
async function getPostPreview(req, res){
    if(req.headers.referer === undefined) return res.redirect('back');
    if(req.headers.referer.includes('/new')){
        res.locals.referer = req.headers.referer;
        res.locals.post_id = req.session.post.id;
        return res.render('preview', {post: req.session.preview, msg: req.flash('logInfo')})
    }
    if(req.headers.referer.includes('/edit')){
        res.locals.referer = req.headers.referer;
        res.locals.post_id = req.session.post.id;
        console.log('POST PREVIEW', req.session.preview)
        return res.render('preview', {post: req.session.preview, msg: req.flash('logInfo')})
    }
    return res.redirect('back')
}


//@route /preview POST
function passPostPreview(req, res){
    const { minlength: titleMinLength, maxlength: titleMaxLength } = Post.schema.paths.title.options
    const { minlength: bodyMinLength, maxlength: bodyMaxLength } = Post.schema.paths.body.options
    console.log(req.headers.referer)

    const Schema = Joi.object({
        title: Joi.string().min(titleMinLength[0]).max(titleMaxLength[0]).required(),
        body: Joi.string().min(bodyMinLength[0]).max(bodyMaxLength[0]).required(),
        image: Joi.optional()
    })
    const { error } = Schema.validate(req.body)
    if (error) {
        req.flash('logInfo', error.details[0].message)
        return res.redirect('back')   
    } 

    const image = req.session.post?.image
    req.session.preview = {
        author: req.user,
        title: req.body.title,
        body: req.body.body,
        filename: req.body.image,
        image: image
    }

    return res.redirect('/preview')
}


///////////// POST ////////////////

// @route /new
async function postPost(req, res){
    const LAST_ID = (await Post.findOne().sort('-id'))?.id ?? 0 // przypisuje id 0 jesli zaden post nie istnieje // Lepsze od countDocuments, bo nie zmienia ID w przypadku usuniecia
    const POST_PREVIEW = req.session.preview ?? {};
    let post;

    let imageSrcPath
    let newFilename = `${LAST_ID + 1}-${new Date().toISOString().split('T')[0]}` // returns id-yyyy-mm-dd
    if(!req.is('multipart/form-data')){
            /// TYLKO DLA POST PREVIEW
        if(POST_PREVIEW.filename){
            try{
            const filePath = await storeImage(req.body.img_data, POST_PREVIEW.filename, newFilename)    // automatically adds extension
            const index = filePath.indexOf('public')
            imageSrcPath = filePath.slice(index)
            } catch (err) {
                console.error(err)
            }
        }
    }

    if(req.file){
        const pathExt = path.extname(req.file.originalname)
        newFilename += pathExt
        imageSrcPath = path.join(req.file.destination, newFilename)
        await fs.promises.rename
        (path.join(process.cwd(), req.file.path),
         path.join(process.cwd(), imageSrcPath))
    }

    if(Object.keys(POST_PREVIEW).length > 0){
        post = await Post.create({
            id: LAST_ID + 1,
            title: POST_PREVIEW.title,
            body: POST_PREVIEW.body,
            author: req.user,
            image: imageSrcPath
        })
    } else {
        post = await Post.create({
            id: LAST_ID + 1,
            title: req.body.title,
            body: req.body.body,
            author: req.user,
            image: imageSrcPath ?? undefined
        })
    }
    
    console.log('TEST NOWY', post)
    res.status(201);
    return res.redirect(`/${post.id}`)
}

///////////// PUT PATCH DELETE ////////////////

// @route /:id/edit    PATCH
async function editPost(req, res){
    const POST_PREVIEW = req.session.preview ?? {};


    let newFilename = `${req.params.id}-${new Date().toISOString().split('T')[0]}` // returns id-yyyy-mm-dd
    let imageSrcPath;
    if(!req.is('multipart/form-data')){
        if(POST_PREVIEW.filename)
            try{
            const filePath = await storeImage(req.body.img_data, POST_PREVIEW.filename, newFilename)
            const index = filePath.indexOf('public')
            imageSrcPath = filePath.slice(index)
            } catch (err) {
                console.error(err)
            }
    }

    if(req.file){
        const pathExt = path.extname(req.file.originalname)
        newFilename += pathExt
        imageSrcPath = path.join(req.file.destination, newFilename)
        await fs.promises.rename
        (path.join(process.cwd(), req.file.destination, 'uploaded'),
         path.join(process.cwd(), imageSrcPath))
    }

    if(Object.keys(POST_PREVIEW).length > 0){
        await Post.updateOne({id: req.params.id}, {
            title: POST_PREVIEW.title,
            body: POST_PREVIEW.body,
            edited_by: req.user,
            image: imageSrcPath
        })
    } else {
        await Post.updateOne({id: req.params.id}, {
            title: req.body.title,
            body: req.body.body,
            edited_by: req.user,
            image: imageSrcPath ?? undefined
        })
    }
    
    console.log('3')
    

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
    getPostPreview,
    passPostPreview,
    getEditForm,
    postPost,
    editPost,
    deletePost
}