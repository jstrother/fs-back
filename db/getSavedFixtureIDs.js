import mongoose from 'mongoose';
import { Season } from '../schema/index.js';
import logger from '../utils/logger.js';

export default async function getSavedFixtureIDs() {
  try {
    const fixtureIDs = await Season.aggregate([
      {
        $match: {
          fixture_ids: {
            $ne: null,
            $exists: true,
            $not: { $size: 0 },
          }, // Ensure fixture_ids array exists and is not empty
        },
      },
      {
        $unwind: "$fixture_ids", // Unwind the fixture_ids array to create a document for each club ID
      },
      {
        $group: {
          _id: null, // Group all documents together
          fixtureIDs: { $addToSet: '$fixture_ids' }, // Collect unique fixture IDs
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the output
          fixtureIDs: 1, // Include the fixture IDs in the output
        },
      },
    ]);

    const IDs = fixtureIDs[0]?.fixtureIDs || [];

    if (IDs.length > 0) {
      logger.info(`Retrieved ${IDs.length} unique fixture IDs from the Seasons collection.`);
    } else {
      logger.warn('No unique fixture IDs found in the Seasons collection.');
    }

    return IDs;
  } catch (error) {
    logger.error(`Error retrieving saved fixture IDs: ${error}`);
    throw error;
  }
}