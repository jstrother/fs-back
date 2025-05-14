// This file is imported in:
// - /schema/index.js (exports the Player model)

import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  country_id: Number,
  position_id: Number,
  type_id: Number,
  firstName: String,
  lastName: String,
  common_name: String,
  name: String,
  display_name: String,
  photo: String,
}, { timestamps: true });

export default mongoose.model('Player', playerSchema);