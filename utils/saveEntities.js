/**
 * @file Generic utility for fetching and saving multiple entities to the database in a batch.
 * This module provides a flexible function `saveEntities` that can be used to
 * upsert various types of data (e.g., leagues, seasons, clubs, players, types)
 * from an external API into corresponding Mongoose models. It handles
 * both fetching entities by individual IDs and processing pre-fetched arrays of data.
 * It uses `findOneAndUpdate` with `upsert: true` for efficient database operations
 * and includes robust error logging for individual fetches and saves.
 */
import logger from '../utils/logger.js';

/**
 * A generic function to fetch entities from an API and save/update them in the database.
 * It uses findOneAndUpdate with upsert: true for efficient batch operations.
 *
 * @param {object} options - Configuration object for the saving process.
 * @param {Function} options.fetchFunction - The async function to call to fetch data from the API.
 * If `fetchArgs` is an array of IDs, this function will be called once for each ID.
 * It should return a single raw API data object or null/undefined if data is not found.
 * @param {object} options.Model - The Mongoose Model (e.g., League, Season, Club, Fixture) to save data to.
 * @param {string} options.uniqueKey - The field name in the API data that serves as the unique identifier
 * for the document in the database (e.g., 'id', 'fixture_id').
 * @param {Function} options.mapApiDataToSchema - A function that takes a raw API data object
 * and returns an object formatted for the Mongoose schema's $set operation.
 * @param {string} options.entityName - A singular name for the entity (e.g., 'league', 'season') for logging purposes.
 * @param {Array<any>} [options.fetchArgs=[]] - Optional arguments to pass to the fetchFunction.
 * If this is an array, `fetchFunction` will be called for each item in this array.
 * @returns {Promise<void>}
 */

export default async function saveEntities({
  fetchFunction,
  Model,
  uniqueKey,
  mapApiDataToSchema,
  entityName,
  fetchArgs = [],
}) {
  try {
    logger.info(`Beginning to fetch and save ${entityName}s...`);

    let apiData = [];

    if (Array.isArray(fetchArgs) && fetchArgs.length > 0) {
      const fetchPromises = fetchArgs.map(async (arg) => {
        try {
          const data = await fetchFunction(arg);
          return data;
        } catch (error) {
          return null;
        }
      });
      const allFetchedData = await Promise.all(fetchPromises);
      apiData = allFetchedData.filter(item => item !== null && item !== undefined);
    } else {
      const singleData = await fetchFunction();
      apiData = singleData ? (Array.isArray(singleData) ? singleData : [singleData]) : [];
    }

    if (!apiData || apiData.length === 0) {
      logger.warn(`No ${entityName}s found in API response.`);
      return;
    }

    logger.info(`Fetched ${apiData.length} ${entityName}s from API.`);

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

    await Promise.all(saveOperations);
    logger.info(`Successfully saved/updated ${entityName}s to the database.`);
  } catch (error) {
    logger.error(`Error saving ${entityName}s: ${error.message}`);
    throw error;
  }
}