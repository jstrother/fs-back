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
 * @returns {Promise<void>}
 */
export default async function savePlayers(playerIDs) {
  try {
    await saveEntities({
      fetchFunction: async id => {
        const playerData = await fetchPlayers(id);
        return Array.isArray(playerData) ? playerData[0] : playerData;
      },
      Model: Player,
      uniqueKey: 'id',
      mapApiDataToSchema: player => ({
        country_id: player.country_id,
        position_id: player.position_id,
        type_id: player.type_id,
        firstName: player.firstname,
        lastName: player.lastname,
        name: player.name,
        common_name: player.common_name,
        photo: player.image_path,
        display_name: player.display_name,
      }),
        entityName: 'player',
        fetchArgs: playerIDs,
    });
  } catch (error) {
    logger.error(`Unhandled error in savePlayers function: ${error.message}`);
    throw error;
  }
}