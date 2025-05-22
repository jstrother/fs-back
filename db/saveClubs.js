import { fetchClubs } from '../utils/fetchFunctions.js';
import { Club } from '../schema/index.js';
import logger from '../utils/logger.js';

export default async function saveClubs(seasonIDs) {
  try {
    if (!seasonIDs || !Array.isArray(seasonIDs) || seasonIDs.length === 0) {
      logger.warn('No season IDs provided to save clubs.');
      return;
    }

    logger.info(`Beginning to save clubs for ${seasonIDs.length} leagues`);

    for (const seasonID of seasonIDs) {
      try {
        const clubsData = await fetchClubs(seasonID);

        if (!clubsData || !Array.isArray(clubsData) || clubsData.length === 0) {
          logger.warn(`No clubs data found for season ID ${seasonID}.`);
          continue;
        }

        logger.info(`Fetched clubs from API for season ID ${seasonID}.`);

        const saveOperations = clubsData.map(async (club) => {
          try {
            const newClub = new Club({
              id: club.id,
              name: club.name,
              logo: club.image_path,
              short_code: club.short_code,
              country_id: club.country_id,
              league_id: club.league_id,
            });
            await newClub.save();
            logger.info(`Club ${club.name} (ID: ${club.id}) saved successfully.`);
          } catch (error) {
            if (error.code === 11000) {
              logger.warn(`Club with ID ${club.id} (${club.name}) already exists. Skipping...`);
            } else {
              logger.error(`Error saving club ${club.name} (ID: ${club.id}): ${error}`);
              throw error;
            }
          }
        });

        await Promise.all(saveOperations);
        logger.info(`All clubs for season ID ${seasonID} saved successfully (or skipped due to duplicates).`);
      } catch (error) {
        logger.error(`Error fetching clubs for season ID ${seasonID}: ${error}`);
        continue; // Skip to the next season ID
      }
    }
  } catch (error) {
    logger.error(`Error saving clubs: ${error}`);
    throw error;
  }
}