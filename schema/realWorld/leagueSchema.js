import mongoose from 'mongoose';

const leagueSchema = new mongoose.Schema({
  league_id: { 
    type: Number, 
    required: true,
    unique: true
  },
  league_country_id: {
    type: Number, 
    required: true,
  },
  league_name: {
    type: String, 
    required: true,
  },
  league_short_code: {
    type: String, 
    required: true,
  },
  league_logo: {
    type: String, 
    required: true,
  },
  season_id: {
    type: Number, 
    required: true,
  },
  season_name: {
    type: String, 
    required: true,
  },
  season_start: {
    type: Date,
    required: true,
  },
  season_end: {
    type: Date,
    required: true,
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

export default mongoose.model('League', leagueSchema);