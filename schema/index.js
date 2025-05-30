/**
 * @file Main database connection and initial data synchronization orchestration file.
 * This file establishes the connection to MongoDB and initiates the data sync process
 * for various football entities (leagues, seasons, clubs, fixtures, players)
 * based on defined sync intervals.
 */
import mongoose from 'mongoose';
import { DB_URL } from '../config.js';
import logger from '../utils/logger.js';

import getSavedSeasonIDs from '../db/getSavedSeasonIDs.js';
import getSavedClubIDs from '../db/getSavedClubIDs.js';
import getSavedFixtureIDs from '../db/getSavedFixtureIDs.js';
import getSavedPlayerIDs from '../db/getSavedPlayerIDs.js';

import saveLeagues from '../db/saveLeagues.js';
import saveSeasons from '../db/saveSeasons.js';
import saveClubs from '../db/saveClubs.js';
import saveFixtures from '../db/saveFixtures.js';
import savePlayers from '../db/savePlayers.js';
import saveTypes from '../db/saveTypes.js';

import dataSyncHandler from '../utils/syncManager.js';

/**
 * Establishes a connection to the MongoDB database and orchestrates the initial data synchronization.
 * This function is called once at application startup.
 * @returns {Promise<void>}
 */
export default async function connectDB() {
  try {
    await mongoose.connect(DB_URL);
    logger.info('Connected to database')
    
    await dataSyncHandler('leagues', saveLeagues);

    await dataSyncHandler('seasons', saveSeasons, getSavedSeasonIDs);
    
    await dataSyncHandler('clubs', saveClubs, getSavedClubIDs);

    await dataSyncHandler('fixtures', saveFixtures, getSavedFixtureIDs);

    await dataSyncHandler('players', savePlayers, getSavedPlayerIDs, getSavedSeasonIDs);

    await dataSyncHandler('types', saveTypes);

    logger.info('Application started successfully');
  } catch (error) {
    logger.error(`Error connecting to database: ${error}`);
    process.exit(1);
  }
}

export { default as Player } from './football/playerSchema.js';
export { default as League } from './football/leagueSchema.js';
export { default as Club } from './football/clubSchema.js';
export { default as Fixture } from './football/fixtureSchema.js';
export { default as Season } from './football/seasonSchema.js';

export { default as Type } from './core/typeSchema.js';

export { default as User } from './fantasy/userSchema.js';
export {default as FantasyClub } from './fantasy/fantasyClubSchema.js';

export { default as SyncStatus } from './utility/syncStatusSchema.js';