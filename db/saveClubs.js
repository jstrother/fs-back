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
    logger.warn('No club IDs provided to saveClubs function. Skipping operation.');
    return;
  }

  try {
    logger.info(`Starting to fetch club data for ${clubIDs.length} IDs.`);

    const allClubsToSave = [];

    // Pre-fetch all club data based on the provided IDs concurrently
    const fetchPromises = clubIDs.map(async (id) => {
      try {
        const clubArray = await fetchClubs(id); // fetchClubs(id) returns Promise<[clubObject]>
        // Extract the single club object or return null if not found
        return clubArray && clubArray.length > 0 ? clubArray[0] : null;
      } catch (error) {
        logger.error(`Failed to fetch club ID ${id}: ${error.message}`);
        return null; // Return null for failed fetches
      }
    });

    const fetchedResults = await Promise.all(fetchPromises);

    // Filter out any null results from failed fetches
    const validClubs = fetchedResults.filter(club => club !== null);

    if (validClubs.length === 0) {
        logger.warn(`No valid club data could be fetched for the provided IDs. Skipping save.`);
        return;
    }

    allClubsToSave.push(...validClubs); // Add all valid clubs to the array

    // Call saveEntities, passing a fetchFunction that simply returns our already-collected array
    await saveEntities({
      fetchFunction: async () => allClubsToSave, // This function returns a Promise resolving to our collected array
      Model: Club,
      uniqueKey: 'id',
      mapApiDataToSchema: club => ({
        name: club.name,
        logo: club.image_path,
        country_id: club.country_id,
        short_code: club.short_code,
        // Ensure 'players' array exists before mapping
        roster: club.players ? club.players.map(player => player.player_id) : [],
        league_id: club.leagueId,
      }),
      entityName: 'club',
    });

    logger.info(`Successfully processed and saved/updated ${validClubs.length} club entities.`);
  } catch (error) {
    logger.error(`Unhandled error in saveClubs function: ${error.message}`);
    throw error;
  }
}