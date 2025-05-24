/**
 * @file Retrieves all unique fixture IDs from the Season collection in the database.
 * This module leverages a generic utility to extract fixture IDs from the 'fixture_ids' array field.
 */
import { Season } from '../schema/index.js';
import logger from '../utils/logger.js';
import getIDsFromDB from '../utils/getIDsFromDB.js';

/**
 * Retrieves all unique fixture IDs from the 'fixture_ids' array field within the Season collection.
 * This function assumes that Season documents have a `fixture_ids` field which is an array of fixture IDs.
 *
 * @returns {Promise<number[]>} A promise that resolves to an array of unique fixture IDs.
 * Returns an empty array if no fixture IDs are found or if an error occurs.
 * @throws {Error} If an error occurs during the database query.
 */
export default async function getSavedFixtureIDs() {
  try {
    const fixtureIDs = await getIDsFromDB({
      Model: Season,
      idField: 'fixture_ids',
      entityName: 'fixture',
      isArrayField: true,
    });

    return fixtureIDs;
  } catch (error) {
    logger.error(`Error in getSavedFixtureIDs: ${error}`);
    throw error;
  }
}