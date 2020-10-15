const express = require('express');
const router = express.Router();

// Controller
const userController = require('./../../controllers/UserController');

// @route GET api/users/
// @desc Get All users
// @access public
router.get('/', userController.getUsers);

// @route GET api/users/:id
// @desc Get User
// @access public
router.get('/:id', userController.getUser);


router.post('/updatePassword/:id', userController.updatePassword);


router.post('/resetpassword/', userController.resetPassword);


// @route PUT api/users/:id
// @desc Update User
// @access public
router.put('/:id', userController.updateUser);


// @route PATCH api/users/:id
// @desc Update User
// @access public
router.patch('/:id', userController.patchUser);


// @route DEL api/users/:id
// @desc Delete User
// @access public
router.get('/delete/:id', userController.deleteUser);


module.exports = router;

