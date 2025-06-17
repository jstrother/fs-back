/**
 * @file Mongoose schema for Player entities in the Football data domain.
 * This schema defines the structure for storing detailed information about individual football players.
 */
import { Schema, model } from 'mongoose';


// --- Sub-schema for Player Statistics Details ---
/**
 * @typedef {Object} PlayerStatisticDetail
 * @property {number} id - Unique identifier for the statistic detail entry.
 * @property {number} type_id - The type of statistic represented (e.g., goals, assists, cards).
 * @property {Object} value - The actual statistic value, which can be a complex object (e.g., { total: 4, goals: 4, penalties: 0 }).
 * @property {number | null} [value.total] - The total value for this statistic.
 * @property {number | null} [value.goals] - The goals value, if applicable.
 * @property {number | null} [value.penalties] - The penalties value, if applicable.
 * @property {number | null} [value.home] - The home value, if applicable.
 * @property {number | null} [value.away] - The away value, if applicable.
 */
const PlayerStatisticDetailSchema = new Schema({
  id: Number,
  type_id: Number,
  value: Schema.Types.Mixed, // Allows for complex objects
}, { _id: false });

// --- Sub-schema for Player Statistics ---
/**
 * @typedef {Object} PlayerStatistic
 * @property {number} id - Unique identifier for the player's season statistic entry.
 * @property {number} season_id - The ID of the season this statistic applies to.
 * @property {Array<PlayerStatisticDetail>} details - An array of detailed statistic values for this season/team.
 */
const PlayerStatisticSchema = new Schema({
  id: Number,
  season_id: Number,
  details: [PlayerStatisticDetailSchema],
}, { _id: false });

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
 * @property {PlayerStatistic | null} statistics - A single object representing the player's current season statistics, or null if no current season stats are available.
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
  position_name: { type: String, default: 'Unknown' },
  detailed_position_id: Number,
  detailed_position_name: { type: String, default: 'Unknown' },
  firstName: String,
  lastName: String,
  common_name: String,
  name: String,
  display_name: String,
  photo: String,
  club: { type: Schema.Types.ObjectId, ref: 'Club', default: null },
  country_name: String,
  country_flag: String,
  country_fifa_name: String,
  country_iso3: String,
  statistics: PlayerStatisticSchema,
}, { timestamps: true });

export default model('Player', playerSchema);