/**
 * @file Saves or updates generic type data in the database.
 * This module fetches all available types from the API (e.g., player types, event types)
 * and upserts their data into the Type collection.
 */
import saveEntities from '../utils/saveEntities.js';
import { fetchAllTypes } from '../utils/fetchFunctions.js';
import { Type } from '../schema/index.js';
import logger from '../utils/logger.js';

/**
 * Fetches all available types from the API and saves/updates them in the database.
 * This function is designed to handle common generic types like player positions,
 * event types, or status types.
 *
 * @returns {Promise<void>} A promise that resolves when all type data has been processed.
 * @throws {Error} If an unhandled error occurs during the fetching or saving process.
 */
export default async function saveTypes() {
  try {
    const typesData = await fetchAllTypes();

     logger.info(`DEBUG: Value of typesData received by saveTypes: ${JSON.stringify(typesData).substring(0, 500)}`);
    logger.info(`DEBUG: Is typesData an array? ${Array.isArray(typesData)}`);
    logger.info(`DEBUG: Length of typesData: ${typesData ? typesData.length : 'N/A (not an array)'}`);

    await saveEntities({
      fetchFunction: async (id, typeItem) => typeItem,
      Model: Type,
      uniqueKey: 'id',
      mapApiDataToSchema: type => ({
        name: type.name,
      }),
      entityName: 'type',
      fetchArgs: typesData,
    });
    logger.info(`Finished saving/updating types from API.`);
  } catch (error) {
    logger.error(`Error saving types: ${error}`);
    throw error;
  }
}