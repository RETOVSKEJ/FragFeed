const express = require('express')
const router = express.Router();



const { getPosts, updatePost, postPost, getPost } = require('../controllers/posts.js')



router.route('/').get(getPosts).post(postPost)
router.route('/:id').get(getPost).patch(updatePost)


module.exports = router