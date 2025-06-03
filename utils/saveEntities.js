/**
 * @file Generic utility for fetching and saving multiple entities to the database in a batch.
 * This module provides a flexible function `saveEntities` that assumes entities are
 * already fetched into an array by the provided `fetchFunction`. It then
 * upserts these entities into corresponding Mongoose models using `findOneAndUpdate`
 * with `upsert: true` for efficient database operations. It includes robust error logging.
 */
import logger from '../utils/logger.js';

/**
 * A generic function to save/update entities in the database.
 * It expects the `fetchFunction` to return a Promise that resolves with an array of API data.
 * It then uses `findOneAndUpdate` with `upsert: true` for efficient batch operations.
 *
 * @param {object} options - Configuration object for the saving process.
 * @param {Function} options.fetchFunction - The async function that, when called,
 * returns a Promise resolving to an `Array<object>` of raw API data entities.
 * This function is responsible for fetching all necessary data, including handling pagination
 * and any specific arguments (e.g., player ID).
 * @param {object} options.Model - The Mongoose Model (e.g., League, Season, Club, Fixture) to save data to.
 * @param {string} options.uniqueKey - The field name in the API data that serves as the unique identifier
 * for the document in the database (e.g., 'id', 'fixture_id').
 * @param {Function} options.mapApiDataToSchema - A function that takes a raw API data object
 * and returns an object formatted for the Mongoose schema's `$set` operation.
 * @param {string} options.entityName - A singular name for the entity (e.g., 'league', 'season') for logging purposes.
 * @returns {Promise<void>} A promise that resolves when all entities have been processed.
 */
export default async function saveEntities({
  fetchFunction,
  Model,
  uniqueKey,
  mapApiDataToSchema,
  entityName,
}) {
  try {
    logger.info(`Beginning to fetch and save ${entityName} entities...`);
    
    const apiData = await fetchFunction();

    if (!apiData || apiData.length === 0) {
      logger.warn(`No ${entityName} entities found for saving after fetching from API.`);
      return;
    }

    logger.info(`Fetched ${apiData.length} ${entityName} entities from API for saving.`);

    const saveOperations = apiData.map(async apiDataItem => {
      try {
        const dataToSet = mapApiDataToSchema(apiDataItem);
        const query = { [uniqueKey]: apiDataItem[uniqueKey] };

        await Model.findOneAndUpdate(
          query,
          { $set: dataToSet },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (error) {
        logger.error(`Error saving/updating ${entityName} (ID: ${apiDataItem[uniqueKey]}): ${error.message}`);
      }
    });

    await Promise.all(saveOperations); // Wait for all save operations to complete
    logger.info(`Successfully saved/updated all ${entityName} entities to the database.`);
  } catch (error) {
    logger.error(`Error in saveEntities for ${entityName}: ${error.message}`);
    // Log the full stack for better debugging
    logger.error(`Error stack: ${error.stack}`);
    throw error; // Re-throw the main error to the caller of saveEntities
  }
}