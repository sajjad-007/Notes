const express = require('express');
const router = express.Router();

const userRoutes = require('./user.apiRoutes');
const manageAllTask = require("./task.apiRoutes")

router.use('/api/v1/user', userRoutes);
router.use('/api/v1/task', manageAllTask);

module.exports = router;
