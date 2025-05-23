import getIDsFromDB from './getIDsFromDB.js';
import { Season } from '../schema/index.js';
import logger from '../utils/logger.js';

export default async function getSavedClubIDs() {
  try {
    const clubIDs = await getIDsFromDB({
      Model: Season,
      idField: 'club_ids',
      entityName: 'club',
      isArrayField: true,
    });
    
    return clubIDs;
  } catch (error) {
    logger.error(`Error in getSavedClubIDs: ${error}`);
    throw error;
  }
}