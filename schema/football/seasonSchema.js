// This file is imported in:
// - /schema/index.js (exports the Season model)

import { Schema, model } from 'mongoose';

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