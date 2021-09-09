const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Loading User model
const User = require('../models/user')

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Is email in Database?
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: 'That email is not registered.' })
          }

          // If email exists in DB, does password match?
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err

            // password matches
            if (isMatch) {
              return done(null, user)
            }
            // password DOESNT match
            else {
              return done(null, false, { message: 'Password is incorrect.' })
            }
          })
        })
        .catch((err) => console.log(err))
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
