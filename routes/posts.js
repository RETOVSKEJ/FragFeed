const express = require('express')
const router = express.Router();

const ROLES = require('../permissions/roles')
const { updatePost, postPost, getPost, deletePost } = require('../controllers/posts')
const { getHomepage } = require('../controllers/home')
const { catchAsync } = require('../middleware/errors')
const { authUser, notAuthUser, authRoles } = require('../permissions/auth')


router.route('/')
.get(catchAsync(getHomepage))
.post(authUser, authRoles(ROLES.ADMIN), catchAsync(postPost))

router.route('/posts/:id')
.get(catchAsync(getPost))
.patch(authUser, catchAsync(updatePost))
// .delete(authUser, catchAsync(deletePost))

module.exports = router