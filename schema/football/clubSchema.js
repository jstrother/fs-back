// This file is imported in:
// - /schema/index.js (exports the Club model)

import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const clubSchema = new Schema({
  id: { 
    type: Number, 
    required: true,
    unique: true,
    index: true,
  },
  country_id: Number,
  venue_id: Number,
  name: String,
  short_code: String,
  logo: String,
  league_id: Number,
}, { timestamps: true });

export default mongoose.model('Club', clubSchema);