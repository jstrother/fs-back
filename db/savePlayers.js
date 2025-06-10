/**
 * @file Saves or updates player data in the database for specified player IDs.
 * This module orchestrates the fetching of detailed player information from the API
 * and its upsertion into the Player collection using a generic batch saving utility.
 */
import { fetchPlayers } from '../utils/fetchFunctions.js';
import { Player } from '../schema/index.js';
import saveEntities from '../utils/saveEntities.js';
import logger from '../utils/logger.js';
import parseDateString from '../utils/parseDateString.js';

/**
 * Fetches detailed player data from the API based on a list of player IDs
 * and saves/updates them in the database.
 * It uses the generic saveEntities utility for efficiency.
 *
 * @param {number[]} playerIDs - An array of player IDs to fetch and save.
 * @param {number[]} currentSeasonIDs - An array of current season IDs to filter players by season.
 * Player statistics will only be fetched for the current season.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if an unhandled error occurs during the fetching or saving process.
 */
export default async function savePlayers(playerIDs, currentSeasonIDs) {
  if (!Array.isArray(playerIDs) || playerIDs.length === 0) {
    logger.warn('No player IDs provided to savePlayers function. Skipping operation.');
    return;
  }
  if (!Array.isArray(currentSeasonIDs) || currentSeasonIDs.length === 0) {
    logger.warn('No current season IDs provided to savePlayers function. Statistics may not be filtered correctly. Proceeding without season filtering for stats.');
    // You might choose to throw an error here instead if currentSeasonIDs are mandatory
  }

  try {
    logger.info(`Starting to fetch player data for ${playerIDs.length} IDs.`);

    const allPlayersToSave = [];

    // Pre-fetch all player data based on the provided IDs
    // fetchPlayers(id) returns Promise<Array<object>> (e.g., [playerObject])
    const fetchPromises = playerIDs.map(async (id) => {
      try {
        const playerArray = await fetchPlayers(id);
        // We expect playerArray to be [playerObject] or empty if not found
        return playerArray && playerArray.length > 0 ? playerArray[0] : null;
      } catch (error) {
        logger.error(`Failed to fetch player ID ${id}: ${error.message}`);
        return null; // Return null for failed fetches
      }
    });

    const fetchedResults = await Promise.all(fetchPromises);

    // Filter out any null results from failed fetches
    const validPlayers = fetchedResults.filter(player => player !== null);

    if (validPlayers.length === 0) {
        logger.warn(`No valid player data could be fetched for the provided IDs. Skipping save.`);
        return;
    }

    allPlayersToSave.push(...validPlayers); // Add all valid players to the array

    // Now, call saveEntities, passing a fetchFunction that just returns our already-collected array
    await saveEntities({
      fetchFunction: async () => allPlayersToSave, // This function returns a Promise resolving to our collected array
      Model: Player,
      uniqueKey: 'id',
      // mapApiDataToSchema can still access currentSeasonIDs from the outer scope
      mapApiDataToSchema: player => {
        let currentSeasonStats = null;
        if (player.statistics && Array.isArray(player.statistics) && currentSeasonIDs.length > 0) {
          currentSeasonStats = player.statistics.find(stat =>
            currentSeasonIDs.includes(stat.season_id)
          );
          // The API might return 'details' as an object if there's only one,
          // but we always want it as an array for consistency
          if (currentSeasonStats && currentSeasonStats.details && !Array.isArray(currentSeasonStats.details)) {
            currentSeasonStats.details = [currentSeasonStats.details];
          }
        }

        let clubId = null;
        let today = new Date(2025, 4, 30); // Default to a specific date for testing; replace with new Date() for production
        logger.info(`Using today's date for club filtering: ${today.toISOString()}`);
        if (player.teams && Array.isArray(player.teams) && player.teams.length > 0) {
          player.teams.forEach(team => {
            const [startYear, startMonth, startDay] = parseDateString(team.start);
            const [endYear, endMonth, endDay] = parseDateString(team.end);

            const teamStartDate = new Date(startYear, startMonth, startDay);
            const teamEndDate = team.end ? new Date(endYear, endMonth, endDay) : null;
            
            if (teamStartDate <= today && (teamEndDate && teamEndDate >= today)) {
              clubId = team.team_id;
            }
          });
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
          club_id: clubId,
          country_name: player.country?.name || null, // Defensive checks for nested properties
          country_flag: player.country?.image_path || null,
          country_fifa_name: player.country?.fifa_name || null,
          country_iso3: player.country?.iso3 || null,
          statistics: currentSeasonStats, // This will be null if no matching season stats found
        };
      },
      entityName: 'player',
    });

    logger.info(`Successfully processed and saved/updated ${validPlayers.length} player entities.`);
  } catch (error) {
    logger.error(`Unhandled error in savePlayers function: ${error.message}`);
    throw error;
  }
}