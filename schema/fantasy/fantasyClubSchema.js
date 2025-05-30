/**
 * @file Mongoose schema for FantasyClub entities.
 * This schema defines the structure for storing fantasy soccer club details,
 * including the club name, the user it belongs to, and the players in the club.
 */
import mongoose, { Schema, model } from 'mongoose';

/**
 * @typedef {Object} FantasyClub
 * @property {string} name - The unique name of the club
 * @property {mongoose.Schema.Types.ObjectId} owner - The ID of the User who owns this fantasy club
 * @property {Array<mongoose.Schema.Types.ObjectId>} roster - An array of Player IDs representing the club's roster
 * @property {Date} createdAt - Automatically added by Mongoose timestamps.
 * @property {Date} updatedAt - Automatically added by Mongoose timestamps.
 */
const fantasyClub = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  roster: [{
    type: Schema.Types.ObjectId,
    ref: 'Player',
  }],
  fantasyPoints: {
    type: Number,
    default: 0,
  },
});

export default model('FantasyClub', fantasyClub);