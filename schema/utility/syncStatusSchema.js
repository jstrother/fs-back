import { Schema, model } from 'mongoose';

const syncStatusSchema = new Schema({
  entity_type: {
    type: String,
    required: true,
    unique: true,
    enum: ['players', 'clubs', 'fixtures', 'seasons', 'leagues'],
  },
  last_synced_at: {
    type: Date,
    default: null,
  },
});

export default model('SyncStatus', syncStatusSchema);