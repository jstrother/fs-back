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

    logger.info(`Beginning to fetch and save seasons for ${seasonIDs.length} leagues`);

    const fetchPromises = seasonIDs.map(async (seasonID) => {
      try{
        const seasonsData = await fetchSeasons(seasonID);

        if (!seasonsData) {
          logger.warn(`No detailed season data found for season ID ${seasonID}. Skipping...`);
          return null; // Skip this season ID
        }

        return seasonsData;
      } catch (error) {
        logger.error(`Error fetching seasons for league ID ${seasonID}: ${error}`);
        return null; // Skip this season ID on error
      }
    });

    const allSeasonsData = await Promise.all(fetchPromises);
    const validSeasonsData = allSeasonsData.filter((season) => season !== null);

    if (validSeasonsData.length === 0) {
      logger.warn("No valid seasons data found. Skipping saving seasons.");
      return;
    }

    logger.info(`Saving ${validSeasonsData.length} seasons to the database...`);

    const saveOperations = validSeasonsData.map(async seasonData => {
      const season = Array.isArray(seasonData) ? seasonData[0] : seasonData; // Get the actual season object in case of an array
      try {
        const teamIds = season.teams ? season.teams.map(team => team.id) : [];
        const fixtureIds = season.fixtures ? season.fixtures.map(fixture => fixture.id) : [];

        await Season.findOneAndUpdate(
          { id: season.id },
          {
            $set: {
              name: season.name,
              start_date: season.starting_at ? new Date(season.starting_at) : null,
              end_date: season.ending_at ? new Date(season.ending_at) : null,
              league_id: season.league_id,
              club_ids: teamIds,
              fixture_ids: fixtureIds,
            }
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        );
      } catch (error) {
        logger.error(`Error saving/updating season ${season.id}: ${error}`);
      }
    });

    await Promise.all(saveOperations);
    logger.info(`Finished saving/updating seasons to the database`);
  } catch (error) {
    logger.error(`Error saving seasons: ${error}`);
    throw error;
  }
}