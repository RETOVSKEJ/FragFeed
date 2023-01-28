
const path = require('path')

// @ desc error handler musi miec 4 argumenty, inaczej nie bedzie dzialac
function errorHandler(err, req, res, next){ 
    // if (res.headersSent) {
    //     return next(err)
    // }

    console.log(res.statusCode)
    console.log(err.stack)
    if (err.name == 'ValidationError'){
        req.flash('error', `${err.message}`)
        console.info("Redirecting...")
        return res.redirect(req.path)
    }
    if ((req.path).match('.css|.html|.jpg|.png')) 
        console.error(`NIE UDALO SIE WCZYTAC PLIKU STATYCZNEGO ${req.path}`)
        // res.status(500).render('500', {err})
    if(err.message == 400 || res.statusCode == 400)
        return res.render('400', {err})                               // DEV - domyslnie modal popup
    if(err.message == 404 || res.statusCode == 404) {
        if(req.accepts('html')) 
            return res.sendFile(path.resolve('public/404.html'))
        else 
            return res.json({error: "404 json"})
    }
    res.status(500).sendFile(path.resolve('public/error.html')) // resolve to join, ale zwraca ABSOLUTE path do glownej sciezki projektu
}

// wrapper ktory dodajemy przed kazda async funkcja w routach.
function catchAsync(fn) {        // wylapuje wszystkie SYNTAX I THROW ERRORY PRZY KOMPILACJI       
    return (req, res, next) => {
        fn(req, res, next).catch((err, req) => next(err, req))   // next(err), wywola mi kolejny middleware, czyli error handler, ktoremu przekaze error
    }
}

module.exports = {
    errorHandler,
    catchAsync
}