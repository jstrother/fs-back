/**
 * @file Retrieves all unique season IDs from the League collection in the database.
 * This module leverages a generic utility to extract IDs from a specified field.
 */
import getIDsFromDB from '../utils/getIDsFromDB.js';
import { League } from '../schema/index.js';
import logger from '../utils/logger.js';

/**
 * Retrieves all unique season IDs from the 'season_id' field within the League collection.
 * This function assumes that League documents have a `season_id` field representing
 * the current season associated with that league.
 *
 * @returns {Promise<number[]>} A promise that resolves to an array of unique season IDs.
 * Returns an empty array if no season IDs are found or if an error occurs.
 * @throws {Error} If an error occurs during the database query.
 */
export default async function getSavedSeasonIDs() {
  try {
    const seasonIDs = await getIDsFromDB({
      Model: League,
      idField: 'season_id',
      entityName: 'season',
    });

    return seasonIDs;
  } catch (error) {
    logger.error(`Error rin getSavedSeasonIDs: ${error}`);
    throw error;
  }
}