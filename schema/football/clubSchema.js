/**
 * @file Mongoose schema for Club entities in the Football data domain.
 * This schema defines the structure for storing detailed information about football clubs (teams),
 * including their associated players (roster).
 */
import { Schema, model } from 'mongoose';

/**
 * @typedef {Object} Club
 * @property {number} id - The unique identifier for the club from the external API.
 * @property {number} country_id - The ID of the country the club is based in.
 * @property {string} name - The full name of the club (e.g., "Manchester United").
 * @property {string | null} short_code - A short code or abbreviation for the club (e.g., "MUN").
 * @property {string | null} logo - The URL to the club's logo.
 * @property {number | null} league_id - The ID of the primary league the club participates in.
 * @property {number[]} roster - An array of IDs of players currently on the club's roster (references `Player` model).
 * @property {Date} createdAt - Automatically added by Mongoose timestamps.
 * @property {Date} updatedAt - Automatically added by Mongoose timestamps.
 */

const clubSchema = new Schema({
  id: { 
    type: Number, 
    required: true,
    unique: true,
    index: true,
  },
  country_id: Number,
  name: String,
  short_code: String,
  logo: String,
  league_id: Number,
  roster: [{ type: Number, ref: 'Player' }],
}, { timestamps: true });

export default model('Club', clubSchema);