/**
 * @file Saves or updates player data in the database for specified player IDs.
 * This module orchestrates the fetching of detailed player information from the API
 * and its upsertion into the Player collection using a generic batch saving utility.
 */
import { fetchPlayers } from '../utils/fetchFunctions.js';
import { Player } from '../schema/index.js';
import saveEntities from '../utils/saveEntities.js';
import logger from '../utils/logger.js';

/**
 * Fetches detailed player data from the API based on a list of player IDs
 * and saves/updates them in the database.
 * It uses the generic saveEntities utility for efficiency.
 *
 * @param {number[]} playerIDs - An array of player IDs to fetch and save.
 * @param {number[]} currentSeasonIDs - An array of current season IDs to filter players by season.
 * Player statistics will only be fetched for the current season.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the fetching or saving process fails.
 */
export default async function savePlayers(playerIDs, currentSeasonIDs) {
  if (!Array.isArray(playerIDs) || playerIDs.length === 0) {
    logger.warn('No player IDs provided to savePlayers function.');
    return;
  }
  if (!Array.isArray(currentSeasonIDs) || currentSeasonIDs.length === 0) {
    logger.warn('No current season IDs provided to savePlayers function.');
    return;
  }
  try {
    await saveEntities({
      fetchFunction: async id => {
        const playerData = await fetchPlayers(id);
        return Array.isArray(playerData) ? playerData[0] : playerData;
      },
      Model: Player,
      uniqueKey: 'id',
      mapApiDataToSchema: player => {
        if (!player) {
          logger.warn(`No player data found for ID: ${player.id}`);
          return null;
        }

        let currentSeasonStats = null;
        if (player.statistics && Array.isArray(player.statistics) && currentSeasonIDs.length > 0) {
          currentSeasonStats = player.statistics.find(stat => 
            currentSeasonIDs.includes(stat.season_id)
          );
          if (currentSeasonStats && currentSeasonStats.details && !Array.isArray(currentSeasonStats.details)) {
            currentSeasonStats.details = [currentSeasonStats.details];
          }
        }

        return {
          id: player.id,
          position_id: player.position_id,
          detailed_position_id: player.detailed_position_id,
          type_id: player.type_id,
          firstName: player.firstname,
          lastName: player.lastname,
          name: player.name,
          common_name: player.common_name,
          photo: player.image_path,
          display_name: player.display_name,
          country_name: player.country.name,
          country_flag: player.country.image_path,
          country_fifa_name: player.country.fifa_name,
          country_iso3: player.country.iso3,
          statistics: currentSeasonStats,
        }
      },
        entityName: 'player',
        fetchArgs: playerIDs,
    });
  } catch (error) {
    logger.error(`Unhandled error in savePlayers function: ${error.message}`);
    throw error;
  }
}