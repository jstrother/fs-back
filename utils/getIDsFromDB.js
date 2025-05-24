import logger from "../utils/logger.js";

/**
 * A generic function to retrieve unique IDs from a specified Mongoose collection.
 * It uses aggregation to handle both direct field IDs and IDs within arrays.
 * Assumes a Mongoose connection is already established.
 *
 * @param {object} options - Configuration object for ID retrieval.
 * @param {object} options.Model - The Mongoose Model (e.g., League, Season) to query.
 * @param {string} options.idField - The name of the field containing the ID (e.g., 'season_id', 'id').
 * If IDs are in an array, this is the name of the array field (e.g., 'club_ids').
 * @param {string} options.entityName - A singular name for the entity (e.g., 'season', 'club', 'fixture') for logging.
 * @param {boolean} [options.isArrayField=false] - Set to true if `idField` is an array of IDs that needs to be unwound.
 * @returns {Promise<number[]>} - A promise that resolves to an array of unique IDs.
 * Returns an empty array if no IDs are found or if there's an error.
 */

export default async function getIDsFromDB({
  Model,
  idField,
  entityName,
  isArrayField = false,
}) {
  try {
    const pipeline = [];

  if (isArrayField) {
    pipeline.push(
      {
        $match: {
          [idField]: { $exists: true, $ne: [], $not: { $size: 0 } },
        },
      },
      {
        $unwind: `$${idField}`,
      },
      {
        $group: {
          _id: null,
          IDs: { $addToSet: `$${idField}` },
        },
      },
    );
  } else {
    pipeline.push(
      {
        $match: {
          [idField]: { $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          IDs: { $addToSet: `$${idField}` },
        },
      },
    );
  }

  pipeline.push(
    {
      $project: {
        _id: 0,
        IDs: 1,
      },
    },
  );

  const result = await Model.aggregate(pipeline);

  const IDs = result[0].IDs || [];

  if (IDs.length > 0) {
    logger.info(`Found ${IDs.length} unique ${entityName} IDs in the ${Model.collection.name} collection.`);
  } else {
    logger.warn(`No unique ${entityName} IDs found in the ${Model.collection.name} collection.`);
  }
  return IDs;
  } catch (error) {
    logger.error(`Error retrieving ${entityName} IDs from the ${Model.collection.name} collection: ${error}`);
    throw error;
  }
}