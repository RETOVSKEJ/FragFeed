const express = require('express')
const router = express.Router();

const { getPosts, updatePost, postPost, getPost, deletePost } = require('../controllers/posts.js')
const { catchAsync } = require('../middleware/errors')


router.route('/').get(catchAsync(getPosts)).post(catchAsync(postPost))
router.route('/:id').get(catchAsync(getPost)).patch(catchAsync(updatePost)).delete(catchAsync(deletePost))


module.exports = router