require('dotenv').config()

const express = require('express');
const connectDB = require('./db')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const { errorHandler } = require('./middleware/errors');
const logEvents = require('./middleware/logEvents');
const flash = require('express-flash');
////////// login auth  //////////
const session = require('express-session');
const bcrypt = require('bcrypt')
const methodOverride = require('method-override');
const User = require('./models/User')
const passport = require('passport');
const initializePassword = require('./passport-config');
const MongoStore = require('connect-mongo');
initializePassword(passport,
    nick => User.findByNick(nick)
);



connectDB()
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs')
// app.set('views', path.join(__dirname, 'views'))

////// CUSTOM MIDDLEWARES  /////

app.use(logEvents)

/////////// MIDDLEWARES /////////////////
app.use(express.urlencoded({ extended :true}))  // extended true - moge postować nested objekty, false - flat
app.use(express.json())
app.use(express.static(path.join(__dirname, '/public'), {index: '_'}))  // index zeby nie czytalo index.html jako strony glownej, pomaga obslugiwac html css i obrazki
app.use(cookieParser())
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    // cookie: {
    //     secure: true,                        // DZIAŁA TYLKO DLA HTTPS, NARAZIE NIE DZIALA
    //     maxAge: 30 * 24 * 60 * 60 * 1000           // 30 days of cookie
    // },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
    })
}, 

))
app.use(passport.initialize())
app.use(passport.session())
// app.use(passport.authenticate('remember-me'));
app.use(methodOverride('_method'))
// app.use(cookieParser())
// app.use(cors{ origin: '*' })


//////////// ROUTES ///////////////

const authRouter = require(path.join(__dirname, 'routes/auth'))
const usersRouter = require(path.join(__dirname, 'routes/users'))
const postsRouter = require(path.join(__dirname, 'routes/posts'))
app.use('', authRouter)
app.use('/users', usersRouter) // skraca nam url ktory musimy wpisac w crudach w routerze i podpowiada aplikacji zeby dla url /user, szuka w userRoutach
app.use('', postsRouter)


//////////// ERROR HANDLERS /////////////
app.all('*', (req, res, next) => {     // wczytuje regex do url, jesli jakakolwiek sciezka inna niz w routeach, to error 404
    res.status(404)  
    throw new Error('Nie ma takiej strony! app.all')
    // req.accepts('html') ? res.sendFile('public/404.html', {root: __dirname}) : res.json({error: "404 json"})
})
app.use(errorHandler)


app.listen(PORT, () => console.log(`listening on ${PORT}`))