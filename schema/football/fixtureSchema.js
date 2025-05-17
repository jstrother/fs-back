// This file is imported in:
// - /schema/index.js (exports the Fixture model)

import { Schema, model } from 'mongoose';

const fixtureSchema = new Schema({
  fixture_id: { 
    type: Number, 
    required: true,
    unique: true,
    index: true,
  },
  fixture_start: Date,
  fixture_name: String,
  league_id: Number,
}, { timestamps: true });

export default model('Fixture', fixtureSchema);