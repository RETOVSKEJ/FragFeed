const express = require('express')
const router = express.Router();

const { getPosts, updatePost, postPost, getPost, deletePost } = require('../controllers/posts.js')
const { catchAsync } = require('../middleware/errors')
const { checkAuthenticated, checkNotAuthenticated } = require('../controllers/auth')

router.route('/')
.get(catchAsync(getPosts))
.post(checkAuthenticated, catchAsync(postPost))

router.route('/:id')
.get(catchAsync(getPost))
.patch(checkAuthenticated, catchAsync(updatePost))
// .delete(checkAuthenticated, catchAsync(deletePost))


module.exports = router