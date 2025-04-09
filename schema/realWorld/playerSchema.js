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
  clubTeam: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model('Player', playerSchema);