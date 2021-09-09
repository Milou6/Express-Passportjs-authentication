const express = require('express')
// const Blog = require('../models/blog')
const userController = require('../controllers/userController')

const router = express.Router()

// User ROUTES
router.get('/', userController.user_index)

router.post('/create', userController.user_create_user)

router.get('/logout', userController.user_logout)

module.exports = router
