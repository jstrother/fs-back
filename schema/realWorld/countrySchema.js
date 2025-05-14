import mongoose from 'mongoose';
import { Schema } from 'mongoose';

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

export default mongoose.model('Country', CountrySchema);