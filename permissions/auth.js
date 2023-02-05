function authUser(req,res,next)
{
    if(req.isAuthenticated())
        return next();
    
    res.status(401)
    req.flash('logInfo', 'You must log in to view this page')
    return res.redirect('/login')
    
}
function notAuthUser(req,res,next)
{
    if(!req.isAuthenticated())
        return next();

    res.status(403)
    req.flash('logInfo', 'You cannot view this page')
    return res.redirect('back')
}


function authRoles(role){
    return (req, res, next) => {
        console.log(req.user)

        if (req.user.role === role){
            return next();
        }
        
        res.sendStatus(403); 
        req.flash('logInfo', "you are not allowed to do this")
        // return res.redirect('back');
    }
}

module.exports = {
    authUser,
    notAuthUser,
    authRoles
}
