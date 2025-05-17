import mongoose from "mongoose";
import { fetchSeasons } from "../utils/fetchFunctions.js";
import { Season } from "../schema/index.js";
import logger from "../utils/logger.js";

export default async function saveSeasons(seasonIDs) {
  try {
    if (!seasonIDs || !Array.isArray(seasonIDs) || seasonIDs.length === 0) {
      logger.warn("No season IDs provided to save seasons.");
      return;
    }

    logger.info(`Beginning to save seasons for ${seasonIDs.length} leagues`);

    for (const seasonID of seasonIDs) {
      try {
        const seasonsData = await fetchSeasons(seasonID);

        if (!seasonsData || !Array.isArray(seasonsData) || seasonsData.length === 0) {
          logger.warn(`No seasons data found for season ID ${seasonID}.`);
          continue;
        }

        logger.info(`Fetched seasons from API for season ID ${seasonID}.`);

        const saveOperations = seasonsData.map(async (season) => {
          try {
            const newSeason = new Season({
              id: season.id,
              name: season.name,
              start_date: season.starting_at ? new Date(season.starting_at) : null,
              end_date: season.ending_at ? new Date(season.ending_at) : null,
              league_id: seasonID,
            });
            await newSeason.save();
            logger.info(`Season ${season.name} (ID: ${season.id}) saved successfully.`);
          } catch (error) {
            if (error.code === 11000) {
              logger.warn(`Season with ID ${season.id} (${season.name}) already exists. Skipping...`);
            } else {
              logger.error(`Error saving season ${season.name} (ID: ${season.id}): ${error}`);
              throw error;
            }
          }
        });

        await Promise.all(saveOperations);
        logger.info(`All seasons for league ID ${seasonID} saved successfully (or skipped due to duplicates).`);
      } catch (error) {
        logger.error(`Error fetching seasons for league ID ${seasonID}: ${error}`);
        continue; // Skip to the next league ID
      }
    }
  } catch (error) {
    logger.error(`Error saving seasons: ${error}`);
    throw error;
  }
}