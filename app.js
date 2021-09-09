const express = require('express')
const path = require('path')
const helmet = require('helmet')
require('./config/secrets')

const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')

const passport = require('passport')
const session = require('express-session')
const { ensureAuthenticated } = require('./config/auth')

// =============================================================================
//
// =============================================================================
const app = express()

// Passport config
require('./config/passport')(passport)

//🍃 connect to mongoDB
const dbURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@my1stcluster.b3fhf.mongodb.net/redditClone?retryWrites=true&w=majority`

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('connected to DB')
    app.listen(3000)
  })
  .catch((err) => console.log(err))

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)

// Middleware & static files
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(helmet())
app.use(express.urlencoded({ extended: true })) // gives us access to the form data in create.ejs
app.use(passport.initialize())
app.use(passport.session())

// =============================================================================
//
// =============================================================================
app.get('/', (req, res) => {
  res.render('index')
})

// app.get('/secret', (req, res) => {
//   res.sendFile(path.join(__dirname, '/public/secretpage.html'))
// })

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/register', (req, res) => {
  res.render('register', {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
})

app.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  })(req, res, next)
})

// Protected route, only accessible once logged in
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    name: req.user.firstName
  })
})

// User routes
app.use('/users', userRoutes)

app.post('/login/create', (req, res) => {
  console.log(req.body) // { email: 'emilou@hotmail.com', firstName: 'Emile', lastName: 'Haas' }
})
