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
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      select: false,
      required: [true, 'Password is required'],
      min: [5, 'At least 5 characters'],
      max: [16, 'Maximum 16 characters'],
    },
    address: {
      type: String,
      required: [true, 'Password is required!'],
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
    ResetToken: {
      String,
    },
    resetTokenExpire: {
      String,
    },
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

const User = mongoose.model('user', userSchema);

module.exports = { User };
