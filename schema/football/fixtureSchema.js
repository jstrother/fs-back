/**
 * @file Mongoose schema for Fixture entities in the Football data domain.
 * This schema defines the structure for storing detailed information about individual football matches (fixtures).
 */
import { Schema, model } from 'mongoose';

/**
 * @typedef {Object} Fixture
 * @property {number} id - The unique identifier for the fixture from the external API.
 * @property {string} name - A descriptive name for the fixture (e.g., "Home Team vs Away Team").
 * @property {number} league_id - The ID of the league the fixture belongs to.
 * @property {number} season_id - The ID of the season the fixture belongs to.
 * @property {number | null} stage_id - The ID of the stage within the competition (e.g., 'Group Stage', 'Semi-finals').
 * @property {number | null} round_id - The ID of the round within the competition (e.g., 'Matchday 1').
 * @property {Date | null} start_date - The scheduled start date and time of the fixture.
 * @property {number[]} lineups - An array of Player IDs participating in the fixture's lineups.
 * @property {number} home_team_id - The ID of the home team participating in the fixture.
 * @property {number} away_team_id - The ID of the away team participating in the fixture.
 * @property {Date} createdAt - Automatically added by Mongoose timestamps.
 * @property {Date} updatedAt - Automatically added by Mongoose timestamps.
 */
const fixtureSchema = new Schema({
  id: { 
    type: Number, 
    required: true,
    unique: true,
    index: true,
  },
  name: String,
  league_id: Number,
  season_id: Number,
  stage_id: Number,
  round_id: Number,
  start_date: Date,
  lineups: [{ type: Number, ref: 'Player' }],
  home_team_id: Number,
  away_team_id: Number,
}, { timestamps: true });

export default model('Fixture', fixtureSchema);