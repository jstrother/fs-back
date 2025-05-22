import { Season } from '../schema/index.js';
import logger from '../utils/logger.js';
import getIDsFromDB from './getIDsFromDB.js';

export default async function getSavedFixtureIDs() {
  try {
    const fixtureIDs = await getIDsFromDB({
      Model: Season,
      idField: 'fixture_ids',
      entityName: 'fixture',
      isArrayField: true,
    });

    return fixtureIDs;
  } catch (error) {
    logger.error(`Error in getFixtureIDs: ${error}`);
    throw error;
  }
}