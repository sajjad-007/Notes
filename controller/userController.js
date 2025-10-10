const { User } = require('../model/userSchema');
const { catchAsyncError } = require('../middleware/asyncError');
const { ErrorHandler } = require('../middleware/error');
const { cloudinaryUpload } = require('../helpers/cloudinary');
const { emailTemplate } = require('../helpers/emailTemplate');
const { SendEmail } = require('../utils/nodemailer');

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
  await user.save();
  //otp set to email template
  res.json({
    success: true,
    message: 'Registration successfully!',
    user,
  });
});

const otpVerify = catchAsyncError(async (req, res, next) => {
  console.log('hellowerd');
});

module.exports = { register, otpVerify };
