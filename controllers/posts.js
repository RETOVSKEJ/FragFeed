const Post = require('../models/Post')

const postsBody = ["pierwsze zdanie", "drugie zdanie", "trzeciezdanie", "witam witam"]
//

function getPosts(req, res){
    // retrieve from database
    res.status(200).render('posts')
}

async function getPost(req, res){
    let id = req.params.id - 1; // number
    if(id > postsBody.length) throw Error("404 = Nie ma takiej strony");
    // MOGLBYM TEZ return res.status(404).send/return i
    const post = await Post.findOne({id: req.params.id})
    res.status(200).render('post', {post})
}

// @ route PATCH /posts/:id
function updatePost(req, res){
    // retrieve from database
    postsBody[req.params.id-1] = req.body.tekst
    res.redirect(`/posts/${req.params.id}`)
}

async function postPost(req, res){
    let id;
    try{
    (await Post.countDocuments() === 0) ? id = 0 : id = ((await Post.find().sort('-id').limit(1))[0].id);
    const post = await Post.create({
        id: id + 1,
        title: req.body.title,
        body: req.body.body
    })
    res.redirect(`/posts/${post.id}`)

    } catch (err) {
    console.log(err.message);
    }
    // post in database
    // if(!req.body.tekst) throw Error("Brak tekstu")
    // if(req.body.tekst == "przykladObslugiBledu") return res.status(404).render('ErrorPage')
    // postsBody.push(req.body.tekst)
    // const id = postsBody.length;
}

async function deletePost(req, res){
    try{
        const post = await Post.findOneAndDelete({id: req.params.id})  
        if (!post) 
            throw new Error("Nie ma posta o takim ID!")
        else 
            console.log("usunieto post o id: ", post.id)
    } catch (err) {
        console.log(err);
    }
    res.redirect(`/posts`)
}

// WYWOLANIE USUNIE CALA BAZE DANYCH
async function deleteAllPosts(){
    await Post.deleteMany({})
    console.log("Wszystko usuniete")
}

module.exports = {
    getPosts,
    getPost,
    updatePost,
    postPost,
    deletePost
}