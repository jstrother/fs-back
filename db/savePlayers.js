/**
 * @file Saves or updates player data in the database for specified player IDs.
 * This module orchestrates the fetching of detailed player information from the API
 * and its upsertion into the Player collection using a generic batch saving utility.
 */
import { fetchPlayers } from '../utils/fetchFunctions.js';
import { Player, Club, Type } from '../schema/index.js';
import saveEntities from '../utils/saveEntities.js';
import logger from '../utils/logger.js';
import parseDateString from '../utils/parseDateString.js';

/**
 * Fetches detailed player data from the API based on a list of player IDs
 * and saves/updates them in the database.
 * It uses the generic saveEntities utility for efficiency.
 * It now enriches player data with club references and human-readable position names.
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
    logger.error('No current season IDs provided to savePlayers function. Statistics may not be filtered correctly. Proceeding without season filtering for stats.');
    throw new Error('Current season IDs must be provided to filter player statistics.');
  }

  try {
    logger.info(`Starting to fetch player data for ${playerIDs.length} IDs.`);

    logger.info('Pre-fetching Club and Type data for player associations.');

    const allClubs = await Club.find({}).lean();
    const clubMap = new Map(allClubs.map(club => [club.id, club._id])); // Map club IDs to Mongoose ObjectIds
    logger.info(`Fetched ${allClubs.length} clubs from the database.`);

    const positionTypes = await Type.find({ group: 'position' }).lean();
    const positionMap = new Map(positionTypes.map(type => [type.id, type.name])); // Map position IDs to names
    logger.info(`Fetched ${positionTypes.length} position types from the database.`);

    const statisticTypes = await Type.find({ group: 'statistic' }).lean();
    const statisticMap = new Map(statisticTypes.map(type => [type.id, type.name])); // Map statistic IDs to names
    logger.info(`Fetched ${statisticMap.size} statistic types from the database.`);

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

          // Enrich statistics details with human-readable names
          if (currentSeasonStats && currentSeasonStats.details) {
            currentSeasonStats.details = currentSeasonStats.details.map((detail) => {
              const statisticName = statisticMap.get(detail.type_id) || 'Unknown Statistic';
              return {
                ...detail,
                statistic_name: statisticName,
              };
            });
          }
        }

        let apiClubId = null;
        let mongoClubObjectId = null;

        let today = new Date();

        if (player.teams && Array.isArray(player.teams) && player.teams.length > 0) {
          // Sort teams by start date to find the most recent club
          const sortedTeams = player.teams.sort((a, b) => {
            const dateA = a.start ? new Date(...parseDateString(a.start_date)) : new Date(0);
            const dateB = b.start ? new Date(...parseDateString(b.start_date)) : new Date(0);
            return dateB.getTime() - dateA.getTime(); // Sort descending to get the most recent first
          });

          for (const team of sortedTeams) {
            const [startYear, startMonth, startDay] = parseDateString(team.start_date);
            const teamStartDate = new Date(startYear, startMonth, startDay);

            let teamEndDate = null;
            if (team.end_date) {
              const [endYear, endMonth, endDay] = parseDateString(team.end_date);
              teamEndDate = new Date(endYear, endMonth, endDay);
            }

            if (teamStartDate <= today && (!teamEndDate || teamEndDate >= today)) {
              apiClubId = team.team_id; // Use the team ID from the most recent club
              mongoClubObjectId = clubMap.get(apiClubId); // Get the corresponding MongoDB ObjectId
              if (mongoClubObjectId) {
                break; // Exit loop once we find a valid club
              }
            }
          }
        }

        const positionName = positionMap.get(player.position_id) || 'Unknown';
        const detailedPositionName = positionMap.get(player.detailed_position_id) || 'Unknown';        

        return {
          id: player.id,
          position_id: player.position_id,
          position_name: positionName,
          detailed_position_id: player.detailed_position_id,
          detailed_position_name: detailedPositionName,
          firstName: player.firstname,
          lastName: player.lastname,
          name: player.name,
          common_name: player.common_name,
          photo: player.image_path,
          display_name: player.display_name,
          club: mongoClubObjectId,
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