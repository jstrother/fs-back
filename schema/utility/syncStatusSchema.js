/**
 * @file Mongoose schema for tracking the last successful synchronization time of different data entities.
 * This schema is crucial for implementing rate limiting and ensuring data is not fetched too frequently from external APIs.
 */
import { Schema, model } from 'mongoose';

/**
 * @typedef {Object} SyncStatus
 * @property {string} entity_type - The type of entity being synced (e.g., 'leagues', 'seasons', 'clubs', 'fixtures', 'players').
 * Must be unique and one of the predefined enum values.
 * @property {Date | null} last_synced_at - The timestamp of the last successful synchronization. Null if never synced.
 * @property {Date} createdAt - Automatically added by Mongoose timestamps.
 * @property {Date} updatedAt - Automatically added by Mongoose timestamps.
 */
const syncStatusSchema = new Schema({
  entity_type: {
    type: String,
    required: true,
    unique: true,
    enum: [
      'players',
      'clubs',
      'fixtures',
      'seasons',
      'leagues',
      'countries',
      'types',
    ],
  },
  last_synced_at: {
    type: Date,
    default: null,
  },
});

export default model('SyncStatus', syncStatusSchema);