// This file is imported in:
// - /app.js (for database connection)

import mongoose from 'mongoose';
import { DB_URL } from '../config.js';
import logger from '../utils/logger.js';
import saveLeagues from '../db/saveLeagues.js';
import saveSeasons from '../db/saveSeasons.js';
import saveClubs from '../db/saveClubs.js';

async function connectDB() {
  try {
    await mongoose.connect(DB_URL);
    logger.info('Connected to database')
    
    const currentSeasonIDs = await saveLeagues();

    if (currentSeasonIDs.length > 0) {
      await saveSeasons(currentSeasonIDs);
      await saveClubs(currentSeasonIDs);
    } else {
      logger.warn('No current season IDs found. Skipping club saving.');
    }

    logger.info('Application started successfully');
  } catch (error) {
    logger.error(`Error connecting to database: ${error}`);
    process.exit(1);
  }
}

export { connectDB };

export { default as Player } from './football/playerSchema.js';
export { default as League } from './football/leagueSchema.js';
export { default as Club } from './football/clubSchema.js';
export { default as Fixture } from './football/fixtureSchema.js';
export { default as Season } from './football/seasonSchema.js';

export { default as City } from './core/citySchema.js';
export { default as Type } from './core/typeSchema.js';
export { default as Country } from './core/countrySchema.js';

export { default as User } from './fantasy/userSchema.js';