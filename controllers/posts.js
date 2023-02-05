const Post = require('../models/Post')


async function getPost(req, res, next){
    // if(isNaN(req.params.id)) {res.status(400); throw new Error('Nie istnieje taki post, podaj numer')} 
    const post = await Post.findOne({id: req.params.id}).exec()
    if(!post) {res.status(400); throw new Error('Nie istnieje taki post')}
    res.status(200).render('post', { post: post })
}

// @ route PATCH /:id
function updatePost(req, res){
    // retrieve from database
    res.redirect(`/posts/${req.params.id}`)
}

async function postPost(req, res){
    const LAST_ID = (await Post.find().sort('-id').limit(1))[0]?.id ?? 0 // przypisuje id 0 jesli zadej post nie istnieje
    const post = await Post.create({
        id: LAST_ID + 1,
        title: req.body.title,
        body: req.body.body
    }) 
    console.log("POSTED")
    return res.redirect(`/posts/${post.id}`)
}


async function deletePost(req, res){
    const post = await Post.findOneAndDelete({id: req.params.id}).exec() 
    if (!post) 
        throw new Error("Nie ma posta o takim ID!")
    else 
        console.log("usunieto post o id: ", post.id)
    res.redirect(`/`)
}

// WYWOLANIE USUNIE CALA BAZE DANYCH
// async function deleteAllPosts(){
//     await Post.deleteMany({})
//     console.log("Wszystko usuniete")
// }

module.exports = {
    getPost,
    updatePost,
    postPost,
    deletePost
}