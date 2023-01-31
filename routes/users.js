const express = require("express");
const router = express.Router();


const { catchAsync } = require('../middleware/errors')
const { getUsers, getUser, postUser, deleteUser, updateUser} = require('../controllers/users')
const { checkAuthenticated, checkNotAuthenticated } = require('../controllers/auth')


router.route('/')
.get(catchAsync(getUsers))
.post(checkAuthenticated, catchAsync(postUser))
router.route('/:nick')
.get(catchAsync(getUser))
.delete(checkAuthenticated, catchAsync(deleteUser))
.patch(checkAuthenticated, catchAsync(updateUser))

module.exports = router