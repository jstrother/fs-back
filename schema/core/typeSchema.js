/**
 * @file Mongoose schema for generic Type entities.
 * This schema is designed to store various types of data (e.g., event types, player types, status types)
 * that might be referenced across different parts of the application.
 */
import { Schema, model } from 'mongoose';

/**
 * @typedef {Object} Type
 * @property {number} id - The unique identifier for the type.
 * @property {string} name - The name or description of the type (e.g., "Injury", "Red Card").
 * @property {Date} createdAt - Automatically added by Mongoose timestamps.
 * @property {Date} updatedAt - Automatically added by Mongoose timestamps.
 */
const TypeSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
    index: true,
  },
  name: String,
}, { timestamps: true });

export default model('Type', TypeSchema);