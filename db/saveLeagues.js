import mongoose from 'mongoose';
import savedEntities from './saveEntities.js';
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

    await savedEntities({
      fetchFunction: async () => domesticLeagues, // Use the filtered domesticLeagues instead of trying to filter in factory function
      Model: League,
      uniqueKey: 'id',
      mapApiDataToSchema: (league) => ({
        name: league.name,
        country_id: league.country_id,
        logo: league.image_path,
        short_code: league.short_code,
        season_id: league.currentseason.id,
        season_name: league.currentseason.name,
        season_start_date: league.currentseason.start_date ? new Date(league.currentseason.start_date) : null,
        season_end_date: league.currentseason.end_date ? new Date(league.currentseason.end_date) : null,
      }),
      entityName: 'league',
      fetchArgs: [],
    });
  } catch (error) {
    logger.error(`Error saving leagues: ${error}`);
    throw error;
  }
}