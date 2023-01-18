const express = require('express')
const router = express.Router();



const { getPosts, updatePost, postPost, getPost, deletePost } = require('../controllers/posts.js')



router.route('/').get(getPosts).post(postPost)
router.route('/:id').get(getPost).patch(updatePost).delete(deletePost)


module.exports = router