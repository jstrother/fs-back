import mongoose from 'mongoose';
import { DB_URL } from '../config.js';

async function connectDB() {
  try {
    await mongoose.connect(DB_URL);
    console.log('Connected to database');
  } catch (error) {
    console.error(`Error connecting to database: ${error}`);
  }
}

export { connectDB };
export { default as Player } from './realWorld/playerSchema.js';
export { default as League } from './realWorld/leagueSchema.js';
export { default as Club } from './realWorld/clubSchema.js';
export { default as Fixture } from './realWorld/fixtureSchema.js';

export { default as User } from './fantasy/userSchema.js';