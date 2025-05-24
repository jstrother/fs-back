/**
 * @file Mongoose schema for Player entities in the Football data domain.
 * This schema defines the structure for storing detailed information about individual football players.
 */
import { Schema, model } from 'mongoose';

/**
 * @typedef {Object} Player
 * @property {number} id - The unique identifier for the player from the external API.
 * @property {string} name - The full name of the player.
 * @property {number} country_id - The ID of the country the player belongs to (references Country model).
 * @property {number} club_id - The ID of the player's current club (references Club model).
 * @property {string} position - The player's primary playing position (e.g., 'Forward', 'Midfielder').
 * @property {Date | null} date_of_birth - The player's date of birth.
 * @property {Date} createdAt - Automatically added by Mongoose timestamps.
 * @property {Date} updatedAt - Automatically added by Mongoose timestamps.
 */
const playerSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  country_id: Number,
  position_id: Number,
  type_id: Number,
  firstName: String,
  lastName: String,
  common_name: String,
  name: String,
  display_name: String,
  photo: String,
}, { timestamps: true });

export default model('Player', playerSchema);