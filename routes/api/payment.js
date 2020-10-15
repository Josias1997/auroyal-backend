const express = require('express');
const router = express.Router();

// Controller
const paymentController = require('./../../controllers/PaymentController');

// @route POST api/auth/login
// @desc Login user
// @access public
router.post('/pay', paymentController.handlePayment);

module.exports = router;