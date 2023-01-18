require('dotenv').config()

const express = require('express');
const connectDB = require('./db')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const { errorHandler } = require('./middleware/errors.js')

connectDB()
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs')
// app.set('views', path.join(__dirname, 'views'))



// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({ extended :true}))  // extended true - moge postować nested objekty, false - flat
app.use(express.static(path.join(__dirname, 'public'), {index: '_'}))  // index zeby nie czytalo index.html jako strony glownej
// app.use(cookieParser())
// app.use(cors{ origin: '*' })


// ROUTES
const userRouter = require(path.join(__dirname, 'routes/user'))
const postsRouter = require(path.join(__dirname, 'routes/posts'))
app.use('/user', userRouter) // skraca nam url ktory musimy wpisac w crudach w routerze i podpowiada aplikacji zeby dla url /user, szuka w userRoutach
app.use('/posts', postsRouter)

// ERROR HANDLER

app.use(errorHandler)

//CRUD
app.get('/', (req, res) => {
    res.render('homePage')
})


app.listen(PORT, () => console.log(`listening on ${PORT}`))