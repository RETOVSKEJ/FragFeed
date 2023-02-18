const express = require("express");
const router = express.Router();

const ROLES = require('../models/roles')
const { catchAsync } = require('../middleware/errors')
const { getUsers, getUser, postUser, deleteUser, updateUser} = require('../controllers/users')
const { authUser, notAuthUser } = require('../middleware/permissions')


router.route('/')
.get(catchAsync(getUsers))
.post(authUser, catchAsync(postUser))

router.route('/:nick')
.get(catchAsync(getUser))
.delete(authUser, catchAsync(deleteUser))
.patch(authUser, catchAsync(updateUser))

module.exports = router