const { User } = require('../model/userSchema');
const { catchAsyncError } = require('../middleware/asyncError');
const { ErrorHandler } = require('../middleware/error');
const { dailyTask } = require('../model/dailyTaskSchema');

const createTask = catchAsyncError(async (req, res, next) => {
  const { description, title } = req.body;
  if (!title || !description) {
    return next(new ErrorHandler('Credentials Missing!', 404));
  }
  // now create your first task
  const task = await dailyTask.create({
    title,
    description,
  });
  if (!task) {
    return next(new ErrorHandler("Couldn't create a new task", 400));
  }
  res.status(200).json({
    success: true,
    message: 'New task created',
    task,
  });
});
const getAllTask = catchAsyncError(async (req, res, next) => {
  // find all my task
  const task = await dailyTask.find({});
  if (!task) {
    return next(new ErrorHandler('Task Not found!', 404));
  }
  res.status(200).json({
    success: true,
    message: 'Successfully found all task',
    task,
  });
});
const deleteTask = catchAsyncError(async (req, res, next) => {
  // find all my task
  const { id } = req.params;
  if (!id) {
    return next(new ErrorHandler('Credentials Missing!', 404));
  }
  const task = await dailyTask.findByIdAndDelete({ _id: id });
  if (!task) {
    return next(new ErrorHandler('Task Not found!', 404));
  }
  res.status(200).json({
    success: true,
    message: 'Task removed!',
    task,
  });
});

module.exports = { createTask, getAllTask, deleteTask };
