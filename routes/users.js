const express = require("express");
const router = express.Router();


const { catchAsync } = require('../middleware/errors')
const { getUsers, getUser, postUser, deleteUser, updateUser} = require('../controllers/users')

router.route('/').get(catchAsync(getUsers)).post(catchAsync(postUser))
router.route('/:nickname').get(catchAsync(getUser)).delete(catchAsync(deleteUser)).patch(catchAsync(updateUser))

module.exports = router