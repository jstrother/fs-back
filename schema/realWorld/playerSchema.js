// This file is imported in:
// - /schema/index.js (exports the Player model)
// - /statistics/players/extractPlayerInfo.js (uses Player model for database operations)

import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  player_id: {
    type: Number,
    required: true,
    unique: true,
  },
  player_country_id: {
    type: Number,
    required: true,
  },
  player_nationality_id: {
    type: Number,
    required: true,
  },
  player_position: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  commonName: {
    type: String,
    required: true,
  },
  jerseyNumber: {
    type: Number,
    required: false,
  },
  player_club_id: {
    type: Number,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  stats: {
    type: Array,
    required: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model('Player', playerSchema);