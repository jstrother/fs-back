// This file is imported in:
// - /schema/index.js (exports the City model)

import { Schema, model } from "mongoose";

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

export default model("City", CitySchema);