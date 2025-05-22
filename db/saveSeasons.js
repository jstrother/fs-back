import { fetchSeasons } from '../utils/fetchFunctions.js';
import { Season } from '../schema/index.js';
import logger from '../utils/logger.js';
import saveEntities from './saveEntities.js';

export default async function saveSeasons(seasonIDs) {
  try {
    await saveEntities({
      fetchFunction: async id => {
        const seasonData = await fetchSeasons(id);
        return Array.isArray(seasonData) ? seasonData[0] : seasonData;
      },
      Model: Season,
      uniqueKey: 'id',
      mapApiDataToSchema: season => ({
        name: season.name,
        start_date: season.starting_at ? new Date(season.starting_at) : null,
        end_date: season.ending_at ? new Date(season.ending_at) : null,
        league_id: season.leagueId,
        club_ids: season.teams ? season.teams.map(team => team.id) : [],
        fixture_ids: season.fixtures ? season.fixtures.map(fixture => fixture.id) : [],
      }),
      entityName: 'season',
      fetchArgs: seasonIDs,
    });
  } catch (error) {
    logger.error(`Error saving seasons: ${error}`);
    throw error;
  }
}