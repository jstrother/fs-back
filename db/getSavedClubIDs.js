import mongoose from "mongoose";
import { Season } from "../schema/index.js";
import logger from "../utils/logger.js";

export default async function getSavedClubIDs() {
  try {
    const clubIDs = await Season.aggregate([
      {
        $match: {
          club_ids: {
            $ne: null,
            $exists: true,
            $not: { $size: 0 },
          }, // Ensure club_ids array exists and is not empty
        },
      },
      {
        $unwind: "$club_ids", // Unwind the club_ids array to create a document for each club ID
      },
      {
        $group: {
          _id: null, // Group all documents together
          clubIDs: { $addToSet: "$club_ids" }, // Collect unique club IDs
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the output
          clubIDs: 1, // Include the club IDs in the output
        },
      },
    ]);

    const IDs = clubIDs[0]?.clubIDs || [];

    if (IDs.length > 0) {
      logger.info(`Retrieved ${IDs.length} unique club IDs from the Seasons collection.`);
    } else {
      logger.warn('No unique club IDs found in the Seasons collection.');
    }

    return IDs;
  } catch (error) {
    logger.error(`Error retrieving saved club IDs: ${error}`);
    throw error;
  }
}