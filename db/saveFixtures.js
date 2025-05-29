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
 * @throws {Error} If an unhandled error occurs during the saving process.
 */
export default async function saveFixtures(fixtureIDs) {
  if (!Array.isArray(fixtureIDs) || fixtureIDs.length === 0) {
    logger.warn('No fixture IDs provided to saveFixtures function.');
    return;
  }
  try {
    await saveEntities({
      fetchFunction: async (id) => {
        const fixtureData = await fetchFixtures(id);
        return Array.isArray(fixtureData) ? fixtureData[0] : fixtureData;
      },
      Model: Fixture,
      uniqueKey: 'id',
      mapApiDataToSchema: (fixture) => ({
        name: fixture.name,
        league_id: fixture.league_id,
        season_id: fixture.season_id,
        stage_id: fixture.stage_id,
        round_id: fixture.round_id,
        home_team_id: fixture.participants[0].meta.location === 'home' ? fixture.participants[0].id : fixture.participants[1].id,
        away_team_id: fixture.participants[0].meta.location === 'away' ? fixture.participants[0].id : fixture.participants[1].id,
        start_date: fixture.starting_at ? new Date(fixture.starting_at) : null,
        lineups: fixture.lineups ? fixture.lineups.map(player => player.player_id) : [],
      }),
      entityName: 'fixture',
      fetchArgs: fixtureIDs,
    });
  } catch (error) {
    logger.error(`Unhandled error in saveFixtures function: ${error.message}`);
    throw error;
  }
}