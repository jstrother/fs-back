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
}, { timestamps: true });

export default model('Season', seasonSchema);