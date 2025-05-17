import mongoose from "mongoose";
import { League } from "../schema/index.js";
import logger from "../utils/logger.js";

export default async function getSavedSeasonIDs() {
  try {
    const seasonIDs = await League.aggregate([
      {
        $match: {
          season_id: { $ne: null }, // Filter out leagues without a season ID
        },
      },
      {
        $group: {
          _id: null, // Group all documents together
          seasonIDs: { $addToSet: "$season_id" }, // Collect unique season IDs
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the output
          seasonIDs: 1, // Include the season IDs in the output
        },
      },
    ]);

    const IDs = seasonIDs[0]?.seasonIDs || [];

    logger.info(`Retrieved ${seasonIDs.length} saved season IDs from the database.`);
    return IDs;
  } catch (error) {
    logger.error(`Error retrieving saved season IDs: ${error}`);
    throw error;
  }
}