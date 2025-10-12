const { User } = require('../model/userSchema');
const { catchAsyncError } = require('../middleware/asyncError');
const { ErrorHandler } = require('../middleware/error');
const { cloudinaryUpload } = require('../helpers/cloudinary');
const { emailTemplate } = require('../helpers/emailTemplate');
const { SendEmail } = require('../utils/nodemailer');
const { generateJsonwebtoken } = require('../helpers/jwtToken');
const cloudinary = require('cloudinary');
const { removeCookie } = require('../helpers/removeCookies');

//create a new user
const register = catchAsyncError(async (req, res, next) => {
  const { userName, email, password, address } = req.body;
  const { image } = req.files;
  //cheack if a user is already exist or not
  const isUserAlreadyExist = await User.findOne({
    email: email,
    accountVerified: true,
  });
  // if user already exist then throw an error
  if (isUserAlreadyExist) {
    return next(new ErrorHandler('This email is already exist!', 400));
  }
  //
  const userTotalAttemptToRegister = await User.find({
    email: email,
    accountVerified: false,
  });

  if (userTotalAttemptToRegister.length > 3) {
    return next(
      new ErrorHandler(
        'You have excceded your attemt limit!, try 30min late',
        400
      )
    );
  }
  // validation for image
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler('No files were uploaded!', 404));
  }
  if (!req.files.image) {
    return next(new ErrorHandler('Image not found!'));
  }

  // upload image on cloudinary
  const uploadImgOnCloudinary = await cloudinaryUpload(
    image.tempFilePath,
    next
  );
  // create a new user
  const user = await User.create({
    userName,
    email,
    password,
    address,
    image: {
      public_id: uploadImgOnCloudinary.public_id,
      url: uploadImgOnCloudinary.secure_url,
    },
  });
  if (!user) {
    return next(new ErrorHandler('Failed to craete database', 400));
  }
  // generate
  user.otp = await user.generateOtp();
  user.otpExpired = Date.now() * 10 * 60 * 1000;
  const myOtpTemplate = emailTemplate(user.otp);
  await SendEmail(user.email, 'OTP Verification', myOtpTemplate);
  await user.save({ validateBeforeSave: true });
  //otp set to email template
  res.json({
    success: true,
    message: 'Registration successfully!',
    user,
  });
});

const otpVerify = catchAsyncError(async (req, res, next) => {
  const { otp, email } = req.body;
  try {
    //find if user is already verified
    const verifiedUser = await User.findOne({
      email,
      accountVerified: true,
    });
    if (verifiedUser) {
      return next(new ErrorHandler('User is already exist!', 401));
    }
    const findUser = await User.find({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });

    let user;
    //if a user tried to register a couple of time, the his email will be stored in our database
    // so that why we will delete previous attempt
    if (findUser.length > 1) {
      //our current user-info will be stored in 'user'
      user = findUser[0];
      const removeExpiredEmails = await User.deleteMany({
        //$ne = not equal
        _id: { $ne: user._id },
        $or: [{ email: email, accountVerified: false }],
      });
      if (!removeExpiredEmails) {
        return next(new ErrorHandler('User remove unsuccessfull!', 400));
      }
    } else {
      user = findUser[0];
    }
    // const otpExpiredTime = new Date(user.otpExpired).getTime();
    const otpExpiredTime = user.otpExpired;
    const currentTime = Date.now();

    if (currentTime > otpExpiredTime) {
      return next(new ErrorHandler('OTP has been expired!', 400));
    }

    if (user.otp != otp) {
      return next(new ErrorHandler("OTP didn't match!", 401));
    }

    user.accountVerified = true;
    user.otp = null;
    user.otpExpired = null;

    await user.save({ validateBeforeSave: true });
    generateJsonwebtoken(user, 'Otp verification successfull', res, 200);
    // jsonwebtoken(token, 'Otp Verification successfull', user, res, 200);
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler('Error from otp verify', 500));
  }
});

//delete user

const deleteUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.body;
  const findUser = await User.findById({ _id: id });
  if (!findUser) {
    return next(new ErrorHandler('User not found', 404));
  }
  const ImageId = findUser.image.public_id;
  await cloudinary.uploader.destroy(ImageId);
  await findUser.deleteOne();
  removeCookie(res, 'User deleted successfully');
});

// logout

const logout = catchAsyncError(async (req, res, next) => {
  removeCookie(res, 'Logout successfull!');
});

//login route

module.exports = { register, otpVerify, deleteUser, logout };
