/**
 * @file Saves or updates league data in the database.
 * This module fetches all active domestic leagues from the API, filters them,
 * and then upserts their data into the League collection.
 */
import saveEntities from '../utils/saveEntities.js';
import { fetchAllLeagues } from '../utils/fetchFunctions.js';
import { League } from '../schema/index.js';
import logger from '../utils/logger.js';

/**
 * Fetches all domestic league data from the API and saves/updates them in the database.
 * It filters for 'domestic' league types and then uses the `saveEntities` utility
 * for efficient bulk operations.
 *
 * @returns {Promise<void>} A promise that resolves when all domestic leagues have been processed.
 * @throws {Error} If an unhandled error occurs during the saving process.
 */
export default async function saveLeagues() {
  try {
    const leaguesData = await fetchAllLeagues();

    if (!leaguesData || !Array.isArray(leaguesData) || leaguesData.length === 0) {
      logger.warn('No leagues data found to save from the API response.');
      return;
    }

    logger.info(`Fetched ${leaguesData.length} leagues from API. Now filtering for domestic leagues.`);

    const domesticLeagues = leaguesData.filter(league => league.sub_type === 'domestic');

    if (domesticLeagues.length === 0) {
      logger.warn('No domestic leagues found after filtering. Skipping save operation.');
      return;
    }

    logger.info(`Found ${domesticLeagues.length} domestic leagues to save.`);

    await saveEntities({
      fetchFunction: async () => domesticLeagues,
      Model: League,
      uniqueKey: 'id',
      mapApiDataToSchema: (league) => ({
        name: league.name,
        country_id: league.country_id,
        logo: league.image_path,
        short_code: league.short_code,
        season_id: league.currentseason?.id || null, // Use optional chaining to handle cases where currentseason might be undefined
        season_name: league.currentseason?.name || null,
        season_start_date: league.currentseason?.start_date ? new Date(league.currentseason.start_date) : null,
        season_end_date: league.currentseason?.end_date ? new Date(league.currentseason.end_date) : null,
      }),
      entityName: 'league',
    });
  } catch (error) {
    logger.error(`Error saving leagues: ${error.message}`);
    throw error;
  }
}