// This file is imported in:
// - /app.js (for database connection)

import mongoose from 'mongoose';
import { DB_URL } from '../config.js';
import logger from '../utils/logger.js';

import getSavedSeasonIDs from '../db/getSavedSeasonIDs.js';
import getSavedClubIDs from '../db/getSavedClubIDs.js';
import getSavedFixtureIDs from '../db/getSavedFixtureIDs.js';
// import getSavedPlayerIDs from '../db/getSavedPlayerIDs.js';

import saveLeagues from '../db/saveLeagues.js';
import saveSeasons from '../db/saveSeasons.js';
import saveClubs from '../db/saveClubs.js';
import saveFixtures from '../db/saveFixtures.js';

import dataSyncHandler from '../utils/syncManager.js';

async function connectDB() {
  try {
    await mongoose.connect(DB_URL);
    logger.info('Connected to database')
    
    await dataSyncHandler('leagues', saveLeagues);

    await dataSyncHandler('seasons', saveSeasons, getSavedSeasonIDs);
    
    await dataSyncHandler('clubs', saveClubs, getSavedClubIDs);

    await dataSyncHandler('fixtures', saveFixtures, getSavedFixtureIDs);

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

export { default as SyncStatus } from './utility/syncStatusSchema.js';