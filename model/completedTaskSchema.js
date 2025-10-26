const mongoose = require('mongoose');
const { Schema } = mongoose;

const completedTaskSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },
    Status: {
      type: String,
      default: 'Completed',
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'task',
    },
  },
  { timestamps: true }
);

const completedTaskModel = mongoose.model('completedTask', completedTaskSchema);

module.exports = { completedTaskModel };
