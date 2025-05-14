import mongoose from "mongoose";
import { Schema } from "mongoose";

const CitySchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
      index: true,
    },
    name: String,
  },
  { timestamps: true }
);

export default mongoose.model("City", CitySchema);