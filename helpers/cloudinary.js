const cloudinary = require('cloudinary');
const { ErrorHandler } = require('../middleware/error');

const cloudinaryUpload = async (imagePath, next) => {
  try {
    const uploadImgOnCloudinary = await cloudinary.uploader.upload(imagePath, {
      folder: 'NOTESS',
    });
    if (!uploadImgOnCloudinary || uploadImgOnCloudinary.error) {
      console.log(
        'cloudinary error',
        uploadImgOnCloudinary.error || 'cloudinary unknown error'
      );
      return next(new ErrorHandler('Image not found!', 404));
    }
    return uploadImgOnCloudinary;
  } catch (error) {
    console.error('cloudinary error', 500);
    return next(new ErrorHandler('Internal server error from cloudinary', 500));
  }
};

module.exports = { cloudinaryUpload };
