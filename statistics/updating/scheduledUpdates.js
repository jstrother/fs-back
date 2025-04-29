// This file is imported in:
// - /schema/index.js (for initializing data and setting up scheduled jobs)

import cron from 'node-cron';
import getStats from '../getStats.js';
import updatePlayersAndFixtures from './weeklyUpdates.js';
import updateLeaguesAndClubs from './semiAnnualUpdates.js';
import fetchApiTypes from '../../utils/fetchApiTypes.js';
import logger from '../../utils/logger.js';

export async function initializeData() {
  logger.info('Initializing complete dataset');
  try {
    const result = await getStats();
    logger.info(`Successfully initialized data for ${result.length} leagues`);
    return result;
  } catch (error) {
    logger.error(`Initialization failed: ${error.message}`);
    throw error;
  }
}

export function setupScheduledJobs() {
  // Weekly updates for players and fixtures - every Monday @ 3 am
  cron.schedule('0 3 * * 1', async () => {
    logger.info('Starting weekly update for players and fixtures');
    try {
      await updatePlayersAndFixtures();
      logger.info('Weekly update successfully completed');
    } catch (error) {
      logger.error(`Weekly update failed: ${error.message}`);
      throw error;
    }
  });

  // Semi-annual updates for leagues and clubs - every January 1st and July 1st @ 2 am
  cron.schedule('0 2 1 1,7 *', async () => {
    logger.info('Starting semi-annual update for leagues and clubs');
    try {
      await updateLeaguesAndClubs();
      await fetchApiTypes();
      logger.info('Semi-annual update successfully completed');
    } catch (error) {
      logger.error(`Semi-annual update failed: ${error.message}`);
      throw error;
    }
  });

  logger.info('Scheduled jobs have been setup');
}