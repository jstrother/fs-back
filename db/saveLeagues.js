import mongoose from 'mongoose';
import { fetchAllLeagues } from '../utils/fetchFunctions.js';
import { League } from '../schema/index.js';
import logger from '../utils/logger.js';

export default async function saveLeagues() {
  const currentSeasonIDs = [];

  try {
    const leaguesData = await fetchAllLeagues();

    if (!leaguesData || !Array.isArray(leaguesData) || leaguesData.length === 0) {
      logger.warn('No leagues data found to save.');
      return currentSeasonIDs;
    }

    logger.info(`Fetched leagues from API.`);

    const saveOperations = leaguesData.map(async (league) => {
      try {
        if (league.sub_type === 'domestic') {
          const newLeague = new League({
            id: league.id,
            country_id: league.country_id,
            name: league.name,
            short_code: league.short_code,
            logo: league.image_path,
            season_id: league.currentseason?.id || null,
            season_name: league.currentseason?.name || null,
            season_start: league.currentseason?.starting_at ? new Date(league.currentseason.starting_at) : null,
            season_end: league.currentseason?.ending_at ? new Date(league.currentseason.ending_at) : null,
          });
          await newLeague.save();
          currentSeasonIDs.push(newLeague.season_id);
          logger.info(`League ${league.name} (ID: ${league.id}) saved successfully.`);
          logger.info(`Collected season IDs: ${currentSeasonIDs}`);
        }
      } catch (error) {
        if (error.code === 11000) {
          logger.warn(`League with ID ${league.id} (${league.name}) already exists. Skipping...`);
        } else {
          logger.error(`Error saving league ${league.name} (ID: ${league.id}): ${error}`);
          throw error;
        }
      }
    });

    await Promise.all(saveOperations);
    logger.info('All leagues saved successfully (or skipped due to duplicates).');

    return currentSeasonIDs;
  } catch (error) {
    logger.error(`Error saving leagues: ${error}`);
    throw error;
  }
}