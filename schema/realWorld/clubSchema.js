import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  club_id: { 
    type: Number, 
    required: true,
    unique: true
  },
  club_country_id: {
    type: Number, 
    required: true,
  },
  club_venue_id: {
    type: Number, 
    required: true,
  },
  club_name: {
    type: String, 
    required: true,
  },
  club_short_code: {
    type: String, 
    required: true,
  },
  club_logo: {
    type: String, 
    required: true,
  },
  league_id: {
    type: Number, 
    required: true,
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

export default mongoose.model('Club', clubSchema);