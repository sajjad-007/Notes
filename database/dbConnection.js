const mongoose = require('mongoose');
const { catchAsyncError } = require('../middleware/asyncError');
const { ErrorHandler } = require('../middleware/error');

const databaseConnection = async (req, res, next) => {
  try {
    const dbConnect = await mongoose.connect(process.env.DATABASE_URI);
    if (dbConnect) {
      console.log('Database connection successfull');
    } else {
      console.log('failed to connect into database!');
      return next(new ErrorHandler('failed to connect into database!', 400));
    }
  } catch (error) {
    console.log('Database connection failed', error);
    return next(new ErrorHandler('Database connection failed', 500));
  }
};

module.exports = { databaseConnection };
