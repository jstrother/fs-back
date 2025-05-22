import getIDsFromDB from './getIDsFromDB.js';
import { League } from '../schema/index.js';
import logger from '../utils/logger.js';

export default async function getSavedSeasonIDs() {
  try {
    const seasonIDs = await getIDsFromDB({
      Model: League,
      idField: 'season_id',
      entityName: 'season',
    });

    return seasonIDs;
  } catch (error) {
    logger.error(`Error rin getSavedSeasonIDs: ${error}`);
    throw error;
  }
}