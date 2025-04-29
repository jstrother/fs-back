// This file is imported in:
// - /routes/userRouter.js (for user authentication and registration)

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);