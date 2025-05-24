/**
 * @file Mongoose schema for Country entities.
 * This schema defines the structure for storing geographical and identifying information about countries,
 * often used as references for other entities like leagues, clubs, and players.
 */
import { Schema, model } from 'mongoose';

/**
 * @typedef {Object} Country
 * @property {number} id - The unique identifier for the country from the external API.
 * @property {string} name - The common name of the country (e.g., "England", "Spain").
 * @property {string | null} fifa_name - The official FIFA name for the country, if applicable.
 * @property {string | null} iso3 - The ISO 3166-1 alpha-3 code for the country (e.g., "ENG", "ESP").
 * @property {string | null} flag - The URL to an image of the country's flag.
 * @property {Date} createdAt - Automatically added by Mongoose timestamps.
 * @property {Date} updatedAt - Automatically added by Mongoose timestamps.
 */
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

export default model('Country', CountrySchema);