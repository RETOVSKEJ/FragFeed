/// set locals.user so its available in templates
function setUser(req,res,next){
    if(req.user)
        res.locals.user = req.user

    return next();
}


module.exports = {
    setUser,
}