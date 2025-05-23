import { fetchClubs } from '../utils/fetchFunctions.js';
import { Club } from '../schema/index.js';
import saveEntities from './saveEntities.js';
import logger from '../utils/logger.js';

export default async function saveClubs(clubIDs) {
  try {
    await saveEntities({
      fetchFunction: async id => {
        const clubData = await fetchClubs(id);
        return Array.isArray(clubData) ? clubData[0] : clubData;
      },
      Model: Club,
      uniqueKey: 'id',
      mapApiDataToSchema: club => ({
        name: club.name,
        logo: club.image_path,
        country_id: club.country_id,
        short_code: club.short_code,
        roster: club.players ? club.players.map(player => player.id) : [],
        league_id: club.leagueId,
      }),
      entityName: 'club',
      fetchArgs: clubIDs,
    });
  } catch (error) {
    logger.error(`Unhandled error in saveClubs function: ${error.message}`);
    throw error;
  }
}