/**
 * @file Retrieves all unique player IDs from the Club collection in the database.
 * This module leverages a generic utility to extract player IDs from the 'roster' array field.
 */
import { Club } from '../schema/index.js';
import getIDsFromDB from '../utils/getIDsFromDB.js';
import logger from '../utils/logger.js';

/**
 * Retrieves all unique player IDs from the 'roster' array field within the Club collection.
 * This function assumes that Club documents have a `roster` field which is an array of player IDs.
 *
 * @returns {Promise<number[]>} A promise that resolves to an array of unique player IDs.
 * Returns an empty array if no player IDs are found or if an error occurs.
 * @throws {Error} If an error occurs during the database query.
 */
export default async function getSavedPlayerIDs() {
  try {
    const playerIDs = await getIDsFromDB({
      Model: Club,
      idField: 'roster',
      entityName: 'player',
      isArrayField: true,
    });
    return playerIDs;
  } catch (error) {
    logger.error(`Error in getSavedPlayerIDs: ${error.message}`);
    throw error;
  }
}