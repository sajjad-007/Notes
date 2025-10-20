const mongoose = require('mongoose');
const { Schema } = mongoose;

const dailyTaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    Status: {
      type: String,
      enum: ['Pending', 'Finished'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const dailyTask = mongoose.model('task', dailyTaskSchema);

module.exports = { dailyTask };
