import mongoose from 'mongoose';

const fixtureSchema = new mongoose.Schema({
  fixture_id: { 
    type: Number, 
    required: true,
    unique: true
  },
  fixture_start: {
    type: Date,
    required: true,
  },
  fixture_name: {
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

export default mongoose.model('Fixture', fixtureSchema);