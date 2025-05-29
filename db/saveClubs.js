/**
 * @file Saves or updates club data in the database for specified club IDs.
 * This module orchestrates the fetching of detailed club information (including player rosters)
 * from the API and its upsertion into the Club collection using a generic batch saving utility.
 */
import { fetchClubs } from '../utils/fetchFunctions.js';
import { Club } from '../schema/index.js';
import saveEntities from '../utils/saveEntities.js';
import logger from '../utils/logger.js';

/**
 * Fetches detailed club data from the API based on a list of club IDs
 * and saves/updates them in the database.
 * It leverages the `saveEntities` utility for efficient bulk operations.
 *
 * @param {number[]} clubIDs - An array of unique club IDs to fetch and save.
 * @returns {Promise<void>} A promise that resolves when all specified clubs have been processed.
 * @throws {Error} If an unhandled error occurs during the saving process.
 */
export default async function saveClubs(clubIDs) {
  if (!Array.isArray(clubIDs) || clubIDs.length === 0) {
    logger.warn('No club IDs provided to saveClubs function.');
    return;
  }
  try {
    await saveEntities({
      fetchFunction: async id => {
        const clubData = await fetchClubs(id);
        return Array.isArray(clubData) ? clubData[0] : clubData;
      },
      Model: Club,
      uniqueKey: 'id',
      mapApiDataToSchema: club => ({
        name: club.name,
        logo: club.image_path,
        country_id: club.country_id,
        short_code: club.short_code,
        roster: club.players ? club.players.map(player => player.player_id) : [],
        league_id: club.leagueId,
      }),
      entityName: 'club',
      fetchArgs: clubIDs,
    });
  } catch (error) {
    logger.error(`Unhandled error in saveClubs function: ${error.message}`);
    throw error;
  }
}