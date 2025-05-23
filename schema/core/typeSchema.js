// This file is imported in:
// - /schema/index.js (exports the Type model)

import { Schema, model } from 'mongoose';

const TypeSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
    index: true,
  },
  name: String,
}, { timestamps: true });

export default model('Type', TypeSchema);