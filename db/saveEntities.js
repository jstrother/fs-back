import logger from '../utils/logger.js';

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
      const fetchPromises = fetchArgs.map(async arg => {
        try {
          const data = await fetchFunction(arg);
          return data;
        } catch (error) {
          logger.error(`Error fetching individual ${entityName} for ${arg}: ${error.message}`);
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