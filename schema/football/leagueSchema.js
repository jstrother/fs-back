// This file is imported in:
// - /schema/index.js (exports the League model)

import { Schema, model } from 'mongoose';

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