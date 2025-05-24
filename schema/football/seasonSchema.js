/**
 * @file Mongoose schema for Season entities in the Football data domain.
 * This schema defines the structure for storing detailed information about individual football seasons,
 * including references to associated clubs and fixtures.
 */
import { Schema, model } from 'mongoose';

/**
 * @typedef {Object} Season
 * @property {number} id - The unique identifier for the season from the external API.
 * @property {string} name - The name of the season (e.g., "2023/2024").
 * @property {Date | null} start_date - The official start date of the season.
 * @property {Date | null} end_date - The official end date of the season.
 * @property {number} league_id - The ID of the league this season belongs to.
 * @property {number[]} club_ids - An array of IDs of clubs participating in this season (references `Club` model).
 * @property {number[]} fixture_ids - An array of IDs of fixtures played in this season (references `Fixture` model).
 * @property {Date} createdAt - Automatically added by Mongoose timestamps.
 * @property {Date} updatedAt - Automatically added by Mongoose timestamps.
 */
const seasonSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
    index: true,
  },
  name: String,
  start_date: Date,
  end_date: Date,
  league_id: Number,
  club_ids: [{ type: Number, ref: 'Club' }],
  fixture_ids: [{ type: Number, ref: 'Fixture' }],
}, { timestamps: true });

export default model('Season', seasonSchema);