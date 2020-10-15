const express = require('express');
const router = express.Router();

// Controller
const authController = require('./../../controllers/AuthController');

// @route POST api/auth/login
// @desc Login user
// @access public
router.post('/login', authController.login);


// @route POST api/auth/register
// @desc Get All users
// @access public
router.post('/register', authController.register);

module.exports = router;