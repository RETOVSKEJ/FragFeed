require('dotenv').config()

const express = require('express');
const connectDB = require('./db')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const { errorHandler } = require('./middleware/errors');
const logEvents = require('./middleware/logEvents');

connectDB()
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs')
// app.set('views', path.join(__dirname, 'views'))

// CUSTOM MIDDLEWARES

app.use(logEvents)

// MIDDLEWARES
app.use(express.urlencoded({ extended :true}))  // extended true - moge postować nested objekty, false - flat
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public'), {index: '_'}))  // index zeby nie czytalo index.html jako strony glownej, pomaga obslugiwac html css i obrazki
// app.use(cookieParser())
// app.use(cors{ origin: '*' })


// ROUTES
const usersRouter = require(path.join(__dirname, 'routes/users'))
const postsRouter = require(path.join(__dirname, 'routes/posts'))
app.use('/users', usersRouter) // skraca nam url ktory musimy wpisac w crudach w routerze i podpowiada aplikacji zeby dla url /user, szuka w userRoutach
app.use('/posts', postsRouter)


//CRUD
app.get('/', (req, res) => {
    res.render('homePage')
})

// ERROR HANDLERS
app.all('*', (req, res, next) => {     // wczytuje regex do url, jesli jakakolwiek sciezka inna niz w routeach, to error 404
    res.status(404)  
    throw new Error('Nie ma takiej strony! app.all') // wiadomosc 404 to dodatkowe zabezpieczenie
    // req.accepts('html') ? res.sendFile('public/404.html', {root: __dirname}) : res.json({error: "404 json"})
})
app.use(errorHandler)


app.listen(PORT, () => console.log(`listening on ${PORT}`))