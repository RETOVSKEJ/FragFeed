const express = require('express')
const router = express.Router();

const ROLES = require('../models/roles')
const { postPost, getPost, getPostPreview, passPostPreview, deletePost, editPost,  getPostForm, getEditForm, } = require('../controllers/posts')
const { getHomepage } = require('../controllers/home')
const { catchAsync } = require('../middleware/errors')
const { uploadDisk, uploadMemory } = require('../middleware/imageHandler')
const {
  authUser,
  notAuthUser,
  authRoles,
  canAddPost,
  canEditPost,
  canDeletePost,
  canLikePost,
  canCommentPost,
} = require("../middleware/permissions");


router.route('/')
.get(catchAsync(getHomepage))

router.route(`/:id(\\d+)`)
.get(catchAsync(getPost))
.delete(authUser, catchAsync(canDeletePost), catchAsync(deletePost))

router.route(`/:id(\\d+)/edit`)
.get(authUser, catchAsync(canEditPost), catchAsync(getEditForm))   // calls .put from /:id route
.patch(authUser, catchAsync(canEditPost), catchAsync(editPost))

router.route('/new')
.get(authUser, catchAsync(canAddPost), catchAsync(getPostForm))
.post(authUser, catchAsync(canAddPost), catchAsync(postPost))

router.route('/preview')
.get(authUser, catchAsync(canAddPost), getPostPreview)
.post(catchAsync(canAddPost), uploadMemory.single('image'), passPostPreview)

// router.route('/upload')
// .post(, postUpload) // catchAsync(canUploadImage)

module.exports = router