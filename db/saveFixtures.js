/**
 * @file Saves or updates fixture data in the database for specified fixture IDs.
 * This module orchestrates the fetching of detailed fixture information (including participants and lineups)
 * from the API and its upsertion into the Fixture collection using a generic batch saving utility.
 */
import { fetchFixtures } from '../utils/fetchFunctions.js';
import { Fixture } from '../schema/index.js';
import saveEntities from '../utils/saveEntities.js';
import logger from '../utils/logger.js';

/**
 * Fetches detailed fixture data from the API based on a list of fixture IDs
 * and saves/updates them in the database.
 * It leverages the `saveEntities` utility for efficient bulk operations.
 *
 * @param {number[]} fixtureIDs - An array of unique fixture IDs to fetch and save.
 * @returns {Promise<void>} A promise that resolves when all specified fixtures have been processed.
 * @throws {Error} If an unhandled error occurs during the fetching or saving process.
 */
export default async function saveFixtures(fixtureIDs) {
  if (!Array.isArray(fixtureIDs) || fixtureIDs.length === 0) {
    logger.warn('No fixture IDs provided to saveFixtures function. Skipping operation.');
    return;
  }

  try {
    logger.info(`Starting to fetch fixture data for ${fixtureIDs.length} IDs.`);

    const allFixturesToSave = [];

    // Pre-fetch all fixture data based on the provided IDs concurrently
    const fetchPromises = fixtureIDs.map(async (id) => {
      try {
        const fixtureArray = await fetchFixtures(id); // fetchFixtures(id) returns Promise<[fixtureObject]>
        // Extract the single fixture object or return null if not found
        return fixtureArray && fixtureArray.length > 0 ? fixtureArray[0] : null;
      } catch (error) {
        logger.error(`Failed to fetch fixture ID ${id}: ${error.message}`);
        return null; // Return null for failed fetches
      }
    });

    const fetchedResults = await Promise.all(fetchPromises);

    // Filter out any null results from failed fetches
    const validFixtures = fetchedResults.filter(fixture => fixture !== null);

    if (validFixtures.length === 0) {
        logger.warn(`No valid fixture data could be fetched for the provided IDs. Skipping save.`);
        return;
    }

    allFixturesToSave.push(...validFixtures); // Add all valid fixtures to the array

    await saveEntities({
      fetchFunction: async () => allFixturesToSave,
      Model: Fixture,
      uniqueKey: 'id',
      mapApiDataToSchema: (fixture) => {
        // Defensive checks for participants array before accessing elements
        const homeTeamId = (fixture.participants?.[0]?.meta?.location === 'home' ? fixture.participants[0].id : fixture.participants?.[1]?.id) || null;
        const awayTeamId = (fixture.participants?.[0]?.meta?.location === 'away' ? fixture.participants[0].id : fixture.participants?.[1]?.id) || null;

        return {
          name: fixture.name,
          league_id: fixture.league_id,
          season_id: fixture.season_id,
          stage_id: fixture.stage_id,
          round_id: fixture.round_id,
          home_team_id: homeTeamId,
          away_team_id: awayTeamId,
          start_date: fixture.starting_at ? new Date(fixture.starting_at) : null,
          lineups: fixture.lineups ? fixture.lineups.map(player => player.player_id) : [],
        };
      },
      entityName: 'fixture',
    });

    logger.info(`Successfully processed and saved/updated ${validFixtures.length} fixture entities.`);
  } catch (error) {
    logger.error(`Unhandled error in saveFixtures function: ${error.message}`);
    throw error;
  }
}