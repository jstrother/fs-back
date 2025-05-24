/**
 * @file Retrieves all unique club IDs from the Season collection in the database.
 * This module leverages a generic utility to extract club IDs from the 'club_ids' array field.
 */
import getIDsFromDB from '../utils/getIDsFromDB.js';
import { Season } from '../schema/index.js';
import logger from '../utils/logger.js';

/**
 * Retrieves all unique club IDs from the 'club_ids' array field within the Season collection.
 * This function assumes that Season documents have a `club_ids` field which is an array of club IDs.
 *
 * @returns {Promise<number[]>} A promise that resolves to an array of unique club IDs.
 * Returns an empty array if no club IDs are found or if an error occurs.
 * @throws {Error} If an error occurs during the database query.
 */
export default async function getSavedClubIDs() {
  try {
    const clubIDs = await getIDsFromDB({
      Model: Season,
      idField: 'club_ids',
      entityName: 'club',
      isArrayField: true,
    });
    
    return clubIDs;
  } catch (error) {
    logger.error(`Error in getSavedClubIDs: ${error}`);
    throw error;
  }
}