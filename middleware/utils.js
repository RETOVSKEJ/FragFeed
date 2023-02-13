/// set locals.user so its available in templates
function setUser(req,res,next){
    if(req.user)
        res.locals.user = req.user

    return next();
}

function setPath(req,res,next){
    res.locals.urlPath = req.path
    return next()
}


module.exports = {
    setUser,
    setPath
}