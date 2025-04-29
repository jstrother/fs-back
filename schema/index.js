// This file is imported in:
// - /app.js (for database connection)
// - /statistics/players/extractPlayerInfo.js (for Player model)
// - /statistics/updating/weeklyUpdates.js (for models)
// - /routes/auth.js (for User model)
// - /routes/leagues.js (for League model)
// - /routes/clubs.js (for Club model)
// - /routes/fixtures.js (for Fixture model)

import mongoose from 'mongoose';
import { DB_URL } from '../config.js';
import logger from '../utils/logger.js';
import { initializeData, setupScheduledJobs } from '../statistics/updating/scheduledUpdates.js';
import fetchApiTypes from '../utils/fetchApiTypes.js';

async function connectDB() {
  try {
    await mongoose.connect(DB_URL);
    logger.info('Connected to database')
    startApplication();
  } catch (error) {
    logger.error(`Error connecting to database: ${error}`);
    process.exit(1);
  }
}

async function startApplication() {
  try {
    const dataCount = await mongoose.connection.db.collection('leagues').countDocuments();

    if (dataCount === 0) {
      logger.info('No existing data found, initializing database...');
      await initializeData();
      await fetchApiTypes();
    } else {
      logger.info(`Found existing data (${dataCount} leagues), skipping initialization`);
    }

    setupScheduledJobs();
  } catch (error) {
    logger.error(`Error starting application: ${error.message}`);
    process.exit(1);
  }
}

export { connectDB };
export { default as Player } from './realWorld/playerSchema.js';
export { default as League } from './realWorld/leagueSchema.js';
export { default as Club } from './realWorld/clubSchema.js';
export { default as Fixture } from './realWorld/fixtureSchema.js';
export { default as User } from './fantasy/userSchema.js';