/**
 * @file This module orchestrates the fetching and saving of Country entities from the SportMonks API
 * into the application's database. It leverages a generic utility for batch operations,
 * ensuring data consistency and efficiency for geographical country information.
 */
import saveEntities from '../utils/saveEntities.js';
import { fetchCountries } from '../utils/fetchFunctions.js';
import { Country } from '../schema/index.js';
import logger from '../utils/logger.js';

/**
 * Fetches all country data from the API and saves/updates them in the database.
 * This function uses the generic `saveEntities` utility for efficient bulk operations,
 * mapping API data to the Country schema.
 *
 * @returns {Promise<void>} A promise that resolves when all specified country data has been processed.
 * @throws {Error} If an unhandled error occurs during the saving process.
 */

export default async function saveCountries() {
  try {
    await saveEntities({
      fetchFunction: async () => {
        const countriesData = await fetchCountries();
        return Array.isArray(countriesData) ? countriesData : [countriesData];
      },
      Model: Country,
      uniqueKey: 'id',
      mapApiDataToSchema: country => ({
        name: country.name,
        fifa_name: country.fifa_name,
        iso3: country.iso3,
        flag: country.image_path,
      }),
      entityName: 'country',
    });
  }  catch (error) {
    logger.error(`Unhandled error in saveCountries function: ${error}`);
    throw error;
  }
}