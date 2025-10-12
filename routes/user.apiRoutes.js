const express = require('express');
const {
  register,
  otpVerify,
  deleteUser,
  logout,
} = require('../controller/userController');
const _ = express.Router();

_.route('/register').post(register);
_.route('/otpVerify').post(otpVerify);
_.route('/deleteUser').delete(deleteUser);
_.route('/logout').get(logout);

module.exports = _;
