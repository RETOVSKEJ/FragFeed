const express = require('express')

const router = express.Router()

const ROLES = require('../models/roles')
const {
	postPost,
	getPost,
	getTaggedPosts,
	getPostPreview,
	passPostPreview,
	deletePost,
	editPost,
	getPostForm,
	getEditForm,
} = require('../controllers/posts')
const { getHomepage } = require('../controllers/home')
const { catchAsync } = require('../middleware/errors')
const { uploadCompressedDisk } = require('../middleware/imageHandler')
const {
	authUser,
	notAuthUser,
	authRoles,
	canAddPost,
	canEditPost,
	canDeletePost,
	canLikePost,
	canCommentPost,
} = require('../middleware/permissions')

router.route(['/', '/old']).get(catchAsync(getHomepage))

router
	.route('/:id(\\d+)')
	.get(catchAsync(getPost))
	.delete(authUser, catchAsync(canDeletePost), catchAsync(deletePost))

router.route('/tag/:tag').get(catchAsync(getTaggedPosts))

router
	.route('/:id(\\d+)/edit')
	.get(authUser, catchAsync(canEditPost), catchAsync(getEditForm)) // calls .put from /:id route
	.patch(
		authUser,
		catchAsync(canEditPost),
		uploadCompressedDisk.single('image'),
		catchAsync(editPost)
	)

router
	.route('/new')
	.get(authUser, catchAsync(canAddPost), catchAsync(getPostForm))
	.post(
		authUser,
		catchAsync(canAddPost),
		uploadCompressedDisk.single('image'),
		catchAsync(postPost)
	)
// .post(authUser, catchAsync(canAddPost), uploadCompressedDisk.single('image'), catchAsync(postPost))

router
	.route('/preview')
	.get(authUser, catchAsync(canAddPost), catchAsync(getPostPreview))
	.post(catchAsync(canAddPost), passPostPreview)

// router.route('/upload')
// .post(, postUpload) // catchAsync(canUploadImage)

module.exports = router
