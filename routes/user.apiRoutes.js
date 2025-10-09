const express = require('express');
const { register } = require('../controller/userController');
const _ = express.Router();

_.route('/register').post(register);

module.exports = _;
