const express = require('express');
const {
  register,
  otpVerify,
  deleteUser,
  logout,
  login,
  forgotPassword,
  resetPassword,
} = require('../controller/userController');
const { isAuthenticated } = require('../middleware/isAuthenticated');
const _ = express.Router();

_.route('/register').post(register);
_.route('/otpVerify').post(otpVerify);
_.route('/deleteUser').delete(isAuthenticated, deleteUser);
_.route('/login').get(login);
_.route('/logout').get(isAuthenticated, logout);
_.route('/forgot/password').post(forgotPassword);
_.route('/reset/password/:resetToken').post(resetPassword);

module.exports = _;
