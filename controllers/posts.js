const postsBody = ["pierwsze zdanie", "drugie zdanie", "trzeciezdanie", "witam witam"]
//

function getPosts(req, res){
    // retrieve from database
    res.status(200).render('posts')
}

function getPost(req, res){
    let id = req.params.id - 1; // number
    if(id > postsBody.length) throw Error("404 = Nie ma takiej strony")
    // MOGLBYM TEZ return res.status(404).send/return i
    res.status(200).render('post', {postBody: postsBody[id]})
}

// @ route PATCH /posts/:id
function updatePost(req, res){
    // retrieve from database
    postsBody[req.params.id-1] = req.body.tekst
    res.redirect(`/posts/${req.params.id}`)
}

function postPost(req, res){
    // post in database
    if(!req.body.tekst) throw Error("Brak tekstu")
    if(req.body.tekst == "przykladObslugiBledu") return res.status(404).render('ErrorPage')
    postsBody.push(req.body.tekst)
    const id = postsBody.length;
    res.redirect(`/posts/${id}`)
}

module.exports = {
    getPosts,
    getPost,
    updatePost,
    postPost
}