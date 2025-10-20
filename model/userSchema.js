const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, 'User Name is requried'],
      min: [2, 'Minimum 2 characters'],
      max: [30, 'Maximum 30 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
    },
    password: {
      type: String,
      select: false,
      required: [true, 'Password is required'],
      min: [5, 'At least 5 characters'],
      max: [16, 'Maximum 16 characters'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Password is required!'],
      trim: true,
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpired: {
      type: String,
    },
    passwordResetToken: String,
    passwordResetTokenExpire: String,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  // return this.password;
});

userSchema.methods.generateOtp = function () {
  const otp = Math.floor(Math.random() * 90000) + 10000;
  return otp;
};
userSchema.methods.generateJwtToken = function (userId) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};
userSchema.methods.compareHassPassowrd = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};
userSchema.methods.generatePasswordResetToken = function () {
  const passResetToken = crypto.randomBytes(20).toString('hex');
  const passResetTokenHash = crypto
    .createHash('sha256')
    .update(passResetToken)
    .digest('hex');
  this.passwordResetToken = passResetTokenHash;
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;

  return passResetToken;
};

const User = mongoose.model('user', userSchema);

module.exports = { User };
