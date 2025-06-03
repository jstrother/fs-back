/**
 * @file Saves or updates season data in the database for specified season IDs.
 * This module orchestrates the fetching of detailed season information from the API
 * and its upsertion into the Season collection using a generic batch saving utility.
 */
import { fetchSeasons } from '../utils/fetchFunctions.js';
import { Season } from '../schema/index.js';
import logger from '../utils/logger.js';
import saveEntities from '../utils/saveEntities.js';

/**
 * Fetches detailed season data from the API based on a list of season IDs
 * and saves/updates them in the database.
 * It leverages the `saveEntities` utility for efficient bulk operations.
 *
 * @param {number[]} seasonIDs - An array of unique season IDs to fetch and save.
 * @returns {Promise<void>} A promise that resolves when all specified seasons have been processed.
 * @throws {Error} If an unhandled error occurs during the fetching or saving process.
 */
export default async function saveSeasons(seasonIDs) {
  if (!Array.isArray(seasonIDs) || seasonIDs.length === 0) {
    logger.warn('No season IDs provided to saveSeasons function. Skipping operation.');
    return;
  }

  try {
    logger.info(`Starting to fetch season data for ${seasonIDs.length} IDs.`);

    const allSeasonsToSave = [];

    // Pre-fetch all season data based on the provided IDs
    // fetchSeasons(id) returns Promise<Array<object>> (e.g., [seasonObject])
    const fetchPromises = seasonIDs.map(async (id) => {
      try {
        const seasonArray = await fetchSeasons(id);
        // We expect seasonArray to be [seasonObject] or empty if not found
        return seasonArray && seasonArray.length > 0 ? seasonArray[0] : null;
      } catch (error) {
        logger.error(`Failed to fetch season ID ${id}: ${error.message}`);
        return null; // Return null for failed fetches
      }
    });

    const fetchedResults = await Promise.all(fetchPromises);

    // Filter out any null results from failed fetches
    const validSeasons = fetchedResults.filter(season => season !== null);

    if (validSeasons.length === 0) {
        logger.warn(`No valid season data could be fetched for the provided IDs. Skipping save.`);
        return;
    }

    allSeasonsToSave.push(...validSeasons);
    
    await saveEntities({
      fetchFunction: async () => allSeasonsToSave,
      Model: Season,
      uniqueKey: 'id',
      mapApiDataToSchema: season => ({
        name: season.name,
        start_date: season.starting_at ? new Date(season.starting_at) : null,
        end_date: season.ending_at ? new Date(season.ending_at) : null,
        league_id: season.leagueId,
        club_ids: season.teams ? season.teams.map(team => team.id) : [],
        fixture_ids: season.fixtures ? season.fixtures.map(fixture => fixture.id) : [],
      }),
      entityName: 'season',
    });

    logger.info(`Successfully processed and saved/updated ${validSeasons.length} season entities.`);
  } catch (error) {
    logger.error(`Unhandled error in saveSeasons function: ${error.message}`);
    throw error;
  }
}