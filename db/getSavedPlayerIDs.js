import { Club } from '../schema/index.js';
import getIDsFromDB from './getIDsFromDB.js';
import logger from '../utils/logger.js';

export default async function getSavedPlayerIDs() {
  try {
    const playerIDs = await getIDsFromDB({
      Model: Club,
      idField: 'roster',
      entityName: 'player',
      isArrayField: true,
    });
    return playerIDs;
  } catch (error) {
    logger.error(`Error in getSavedPlayerIDs: ${error.message}`);
    throw error;
  }
}