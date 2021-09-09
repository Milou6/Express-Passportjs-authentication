const User = require('../models/user')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const user_index = (req, res) => {
  res.send('users_index')
}

const user_create_user = (req, res) => {
  console.log(req.body) // { email: 'emilou@hotmail.com', firstName: 'Emile', lastName: 'Haas' }
  const { firstName, lastName, email, password } = req.body

  if (!firstName || !lastName || !email || !password) {
    res.render('register', {
      firstName,
      lastName,
      email,
      password
    })
    console.log('Missing input fields...')
  } else {
    const newUser = new User({
      firstName,
      lastName,
      email,
      password
    })
    console.log('creating new user!')

    // Hashing the User password
    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(newUser.password, salt)
    newUser.password = hash

    newUser
      .save()
      .then((result) => {
        res.redirect('/login')
      })
      .catch((err) => console.log(err))

    // res.send('creating user!')
  }
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
