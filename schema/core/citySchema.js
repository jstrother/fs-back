/**
 * @file Mongoose schema for City entities.
 * This schema defines the structure for storing basic geographical information about cities.
 * It's often used as a reference in other schemas (e.g., for venues or club locations).
 */
import { Schema, model } from "mongoose";

/**
 * @typedef {Object} City
 * @property {number} id - The unique identifier for the city from the external API or data source.
 * @property {string} name - The name of the city (e.g., "London", "Madrid").
 * @property {Date} createdAt - Automatically added by Mongoose timestamps.
 * @property {Date} updatedAt - Automatically added by Mongoose timestamps.
 */
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