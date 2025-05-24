/**
 * @file Mongoose schema for League entities in the Football data domain.
 * This schema defines the structure for storing detailed information about football leagues,
 * including their current season's basic details.
 */
import { Schema, model } from 'mongoose';

/**
 * @typedef {Object} League
 * @property {number} id - The unique identifier for the league from the external API.
 * @property {number} country_id - The ID of the country where the league is primarily played.
 * @property {string} name - The full name of the league (e.g., "Premier League").
 * @property {string | null} short_code - A short code or abbreviation for the league (e.g., "PL").
 * @property {string | null} logo - The URL to the league's logo.
 * @property {number | null} season_id - The ID of the current active season for this league.
 * @property {string | null} season_name - The name of the current active season (e.g., "2023/2024").
 * @property {Date | null} season_start - The start date of the current active season.
 * @property {Date | null} season_end - The end date of the current active season.
 * @property {Date} createdAt - Automatically added by Mongoose timestamps.
 * @property {Date} updatedAt - Automatically added by Mongoose timestamps.
 */
const leagueSchema = new Schema({
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
  season_id: Number,
  season_name: String,
  season_start: Date,
  season_end: Date,
}, { timestamps: true });

export default model('League', leagueSchema);