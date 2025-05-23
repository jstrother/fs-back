// This file is imported in:
// - /schema/index.js (exports the Fixture model)

import { Schema, model } from 'mongoose';

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