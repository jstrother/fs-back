/**
 * @file Mongoose schema for User entities in the Fantasy Football application.
 * This schema defines the structure for storing user authentication details and profiles.
 */
import { Schema, model } from 'mongoose';

/**
 * @typedef {Object} User
 * @property {string} email - The user's unique email address, used for login.
 * @property {string} password - The hashed password of the user.
 * @property {string} username - The user's unique chosen username.
 * @property {Date} updated_at - The timestamp of the last time the user's profile was updated.
 * @property {Date} createdAt - Automatically added by Mongoose timestamps, indicating creation date.
 * @property {Date} updatedAt - Automatically added by Mongoose timestamps, indicating last update date.
 */
const userSchema = new Schema({
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
}, { timestamps: true });

export default model('User', userSchema);