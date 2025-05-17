// This file is imported in:
// - /schema/index.js (exports the Country model)

import { Schema, model } from 'mongoose';

const CountrySchema = new Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
    index: true,
  },
  name: String,
  fifa_name: String,
  iso3: String,
  flag: String,
}, { timestamps: true });

export default model('Country', CountrySchema);