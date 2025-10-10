const express = require('express');
const { register, otpVerify } = require('../controller/userController');
const _ = express.Router();

_.route('/register').post(register);
_.route('/login').post(otpVerify);

module.exports = _;
