import mongoose from 'mongoose';
import { fetchAllLeagues } from '../utils/fetchFunctions.js';
import { League } from '../schema/index.js';
import logger from '../utils/logger.js';

export default async function saveLeagues() {
  try {
    const leaguesData = await fetchAllLeagues();

    if (!leaguesData || !Array.isArray(leaguesData) || leaguesData.length === 0) {
      logger.warn('No leagues data found to save.');
      return;
    }

    logger.info(`Fetched leagues from API.`);

    const domesticLeagues = leaguesData.filter(league => league.sub_type === 'domestic');

    if (domesticLeagues.length === 0) {
      logger.warn('No domestic leagues found to save.');
      return;      
    }

    logger.info(`Saving ${domesticLeagues.length} domestic leagues to the database...`);
    const saveOperations = domesticLeagues.map(async league => {
      try {
        let currentSeasonID = null;
        let currentSeasonName = null;
        let currentSeasonStartDate = null;
        let currentSeasonEndDate = null;
        if (league.currentseason) {
          currentSeasonID = league.currentseason.id;
          currentSeasonName = league.currentseason.name;
          currentSeasonStartDate = league.currentseason.starting_at ? new Date(league.currentseason.starting_at) : null;
          currentSeasonEndDate = league.currentseason.ending_at ? new Date(league.currentseason.ending_at) : null;
        }

        await League.findOneAndUpdate(
          { id: league.id },
          {
            $set: {
              country_id: league.country_id,
              name: league.name,
              short_code: league.short_code,
              logo: league.logo,
              season_id: currentSeasonID,
              season_name: currentSeasonName,
              season_start_date: currentSeasonStartDate,
              season_end_date: currentSeasonEndDate,
            }
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        );
      } catch (error) {
        logger.error(`Error saving/updating league ${league.name} (ID: ${league.id}): ${error}`);
      }
    });

    await Promise.all(saveOperations);
    logger.info('All leagues saved/updated successfully.');
  } catch (error) {
    logger.error(`Error saving leagues: ${error}`);
    throw error;
  }
}