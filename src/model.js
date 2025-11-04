import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  tasks: {
    type: Array,
    default: []
  }
});

export const userTasks = mongoose.model('userTask', taskSchema);

