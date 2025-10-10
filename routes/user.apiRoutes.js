const express = require('express');
const { register, otpVerify } = require('../controller/userController');
const _ = express.Router();

_.route('/register').post(register);
_.route('/otpVerify').post(otpVerify);

module.exports = _;
