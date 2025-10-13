const { User } = require('../model/userSchema');
const { ErrorHandler } = require('./error');
const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler('User is not Authenticated', 401));
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  if (!decode) {
    return next(new ErrorHandler('Session or token expire!', 401));
  }
  req.use = await User.findById({ _id: decode.id });
  if (!req.use) {
    return next(new ErrorHandler('User not found!', 404));
  }
  next();
};

module.exports = { isAuthenticated };
