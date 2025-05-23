import { fetchFixtures } from '../utils/fetchFunctions.js';
import { Fixture } from '../schema/index.js';
import saveEntities from './saveEntities.js';
import logger from '../utils/logger.js';

export default async function saveFixtures(fixtureIDs) {
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