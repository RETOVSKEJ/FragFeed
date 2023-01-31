
const path = require('path')


    // if (res.headersSent) {
    //     return next(err)
    // }
// @ desc error handler musi miec 4 argumenty, inaczej nie bedzie dzialac
function errorHandler(err, req, res, next){ 
    console.error(res.statusCode)
    console.error(err.stack)

    /////// LOGIN REGISTER INPUTS //////////////
    if (err.name == 'ValidationError') {
        let type;
        for(let i in err.errors) { 
            type = i; 
            const message = err.errors[type].properties.message
            req.flash('error', `${message}`)
        }

        console.info("Refreshing back after register mistake...")
        return res.redirect('back')
    }

    if(err.name === 'MongoServerError' && err.code === 11000){
        if(!!err.keyValue['email'])
            req.flash('error', 'This email is already taken')
        if(!!err.keyValue['nick'])
            req.flash('error', 'This nick is already taken')
        return res.redirect('back')
    }
    if (err.name == 'MongoServerError'){
        return res.render('500')
    }

    //////// STATIC FILES //////////////

    if ((req.path).match('.css|.html|.jpg|.png')) 
        console.error(`NIE UDALO SIE WCZYTAC PLIKU STATYCZNEGO ${req.path}`)
        // res.status(500).render('500', {err})
        
    /////// DEFAULT HANDLERS ////////////    
    if (err.message == 400 || res.statusCode == 400)
        return res.render('400', {err})              // DEV - domyslnie modal popup

    if (err.message == 404 || res.statusCode == 404) {
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