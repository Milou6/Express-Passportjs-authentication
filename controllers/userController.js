const User = require('../models/user')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const user_index = (req, res) => {
  res.send('users_index')
}

const user_create_user = (req, res) => {
  console.log(req.body) // { email: 'emilou@hotmail.com', firstName: 'Emile', lastName: 'Haas' }
  const { firstName, lastName, email, password, password2 } = req.body
  let errors = 0

  if (!firstName || !lastName || !email || !password || !password2) {
    req.flash('error', 'Please complete all fields!')
    errors += 1
  }

  if (password != password2) {
    req.flash('error', 'Passwords do not match.')
    errors += 1
  }

  if (6 < password.length || password.length > 30) {
    req.flash('error', 'Password must be 6 to 30 characters long.')
    errors += 1
  }

  User.exists({ email: email }).then((exists) => {
    if (exists) {
      req.flash('error', 'This email is already registered.')
      errors += 1
    }

    if (errors > 0) {
      // If errors, render register page again (saving inputs already filled & displaying errors)
      res.render('register', {
        firstName,
        lastName,
        email,
        password,
        password2,
        message: req.flash('error')
      })
    } else {
      // If no errors, add new User to DB
      const newUser = new User({
        firstName,
        lastName,
        email,
        password
      })

      // Hashing the User password
      var salt = bcrypt.genSaltSync(10)
      var hash = bcrypt.hashSync(newUser.password, salt)
      newUser.password = hash

      newUser
        .save()
        .then((result) => {
          req.flash('message', 'You are registered and can now log in!')
          res.render('login', {
            message: req.flash('message')
          })
        })
        .catch((err) => console.log(err))
    }
  })
}

const user_logout = (req, res) => {
  req.logout()
  res.redirect('/')
}

module.exports = {
  user_index,
  user_create_user,
  user_logout
}
