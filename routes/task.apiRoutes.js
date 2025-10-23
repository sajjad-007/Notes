const express = require('express');
const {
  createTask,
  getAllTask,
  deleteTask,
} = require('../controller/dailytaskController');
const _ = express.Router();

_.route('/createTask').post(createTask);
_.route('/getTask').get(getAllTask);
_.route('/deleteTask/:id').delete(deleteTask);
// _.route('/completedTask/:id').delete(deleteTask);

module.exports = _;
