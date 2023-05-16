const express = require('express')

const router = express.Router()

const ROLES = require('../models/roles')
const {
	postPost,
	getPost,
	getRandomPost,
	getSearchResults,
	getTaggedPosts,
	getPostPreview,
	passPostPreview,
	deletePost,
	editPost,
	patchLikePost,
	getPostForm,
	getEditForm,
} = require('../controllers/posts')
const {
	getHome,
	getHomePage,
	postNewsletter,
	getFetchPosts,
} = require('../controllers/home')
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

router.route(['/', '/newest', '/old']).get(catchAsync(getHome))
router.route(['/page', '/page/:num']).get(catchAsync(getHomePage))
router.route('/fetch/posts').get(catchAsync(getFetchPosts))

router
	.route('/:id(\\d+)')
	.get(catchAsync(getPost))
	.delete(authUser, catchAsync(canDeletePost), catchAsync(deletePost))

router
	.route('/:id/like')
	.patch(authUser, catchAsync(canLikePost), catchAsync(patchLikePost))

router.route('/random').get(catchAsync(getRandomPost))
router.route('/tag/:tag').get(catchAsync(getTaggedPosts))
router.route('/search').get(catchAsync(getSearchResults))
router.route('/newsletter').post(catchAsync(postNewsletter))

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

router
	.route('/preview')
	.get(authUser, catchAsync(canAddPost), catchAsync(getPostPreview))
	.post(catchAsync(canAddPost), passPostPreview)

module.exports = router
