const { catchAsyncError } = require('../middleware/asyncError');
const { ErrorHandler } = require('../middleware/error');
const { dailyTask } = require('../model/dailyTaskSchema');
const { completedTaskModel } = require('../model/completedTaskSchema');

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
// Not finished these routes yet
const completedTask = catchAsyncError(async (req, res, next) => {
  // find all my task
  const { id } = req.body;
  if (!id) {
    return next(new ErrorHandler('Credentials Missing!', 404));
  }
  const task = await completedTaskModel.create({ id: id });
  if (!task) {
    return next(new ErrorHandler('Task Not found!', 404));
  }
  if (task) {
    // now delete a task from dailyTask model
    const statusTask = await dailyTask.findByIdAndUpdate(
      { _id: id },
      { Status: 'Completed' },
      { new: true }
    );
    console.log('status updated!');
  }
  res.status(200).json({
    success: true,
    message: 'Task completed successfully',
    task,
  });
});
const getAllcompletedTask = catchAsyncError(async (req, res, next) => {
  // find all my task

  const task = await completedTaskModel.find({}).populate('task');
  if (!task) {
    return next(new ErrorHandler('Task Not found!', 404));
  }
  res.status(200).json({
    success: true,
    message: 'Task completed successfully',
    task,
  });
});

const pendingTask = catchAsyncError(async (req, res, next) => {
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
const overDueTask = catchAsyncError(async (req, res, next) => {
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
// Not finished these routes yet

module.exports = {
  createTask,
  getAllTask,
  deleteTask,
  completedTask,
  getAllcompletedTask,
};
