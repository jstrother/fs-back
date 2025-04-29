// This file is imported in:
// - /utils/fetchApiTypes.js (for API type definitions)
// - /statistics/players/enhancePlayerStatsWithTypeInfo.js (for type lookups)

import mongoose from 'mongoose';

const typeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  developer_name: {
    type: String,
    required: true,
  },
  model_type: {
    type: String,
    required: true,
  },
  stat_group: {
    type: [String, null],
    required: false,
  },
});

export default mongoose.model('Type', typeSchema);