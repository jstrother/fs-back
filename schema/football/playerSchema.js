/**
 * @file Mongoose schema for Player entities in the Football data domain.
 * This schema defines the structure for storing detailed information about individual football players.
 */
import { Schema, model } from 'mongoose';

/**
 * @typedef {Object} Player
 * @property {number} id - The unique identifier for the player from the external API.
 * @property {number} detailed_position_id - The ID of the player's detailed playing position (references a DetailedPosition type).
 * @property {number} position_id - The ID of the player's primary playing position (references a Position type).
 * @property {number} type_id - The ID representing the player's type (e.g., player, coach, etc., references a Type).
 * @property {string | null} firstName - The player's first name.
 * @property {string | null} lastName - The player's last name.
 * @property {string | null} common_name - A commonly used name for the player.
 * @property {string} name - The full name of the player.
 * @property {string | null} display_name - A name optimized for display purposes.
 * @property {string | null} photo - The URL to the player's photo.
 * @property {string | null} country_name - The name of the player's country.
 * @property {string | null} country_flag - The URL to the flag of the player's country.
 * @property {string | null} country_fifa_name - The FIFA name for the player's country.
 * @property {string | null} country_iso3 - The ISO 3166-1 alpha-3 code for the player's country.
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
  position_id: Number,
  detailed_position_id: Number,
  type_id: Number,
  firstName: String,
  lastName: String,
  common_name: String,
  name: String,
  display_name: String,
  photo: String,
  country_name: String,
  country_flag: String,
  country_fifa_name: String,
  country_iso3: String,
}, { timestamps: true });

export default model('Player', playerSchema);