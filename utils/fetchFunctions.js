/**
 * @file Contains specific API fetch functions for various football and core entities.
 * These functions abstract the `createFootballFetchCall` and `createCoreFetchCall`
 * using a generic helper to handle data extraction from async generators, providing
 * a clear and concise interface for fetching different data types.
 */
import { createFootballFetchCall, createCoreFetchCall } from './createFetchCall.js';
import logger from './logger.js'; // Assuming you have a logger utility

/**
 * Generic helper function to fetch data from an async generator and collect all items into an array.
 * This abstracts the common pattern of iterating over paginated results.
 *
 * @param {function(string, string | null, number | null): AsyncGenerator<any, void, void>} fetchGeneratorFunction -
 * The specific async generator function to call (e.g., `createFootballFetchCall` or `createCoreFetchCall`).
 * @param {string} specificEndpoint - The main part of the endpoint for the API call (e.g., 'leagues', 'players').
 * @param {string | null} [includes=null] - Optional semicolon-separated string of related resources to include.
 * @param {number | null} [uniqueId=null] - Optional unique identifier for a specific resource.
 * @param {string} loggerMessagePrefix - A string prefix for logging messages to specify what is being fetched (e.g., 'all external leagues').
 * @returns {Promise<Array<object>>} A promise that resolves with an array of all fetched data objects.
 * @throws {Error} If any error occurs during the fetch operation.
 */
async function fetchAndCollectData(fetchGeneratorFunction, specificEndpoint, includes = null, uniqueId = null, loggerMessagePrefix = 'data') {
  const collectedData = [];
  try {
    // Call the provided fetch generator function to get the async iterator
    const generator = fetchGeneratorFunction(specificEndpoint, includes, uniqueId);
    logger.info(`Starting fetch of ${loggerMessagePrefix}...`);

    // Iterate over the async generator to collect all items from all pages
    for await (const item of generator) { // Remember to call generator() to get the iterator
      collectedData.push(item);
    }

    logger.info(`Successfully fetched ${collectedData.length} ${loggerMessagePrefix}.`);
    return collectedData;
  } catch (error) {
    logger.error(`Error in fetching ${loggerMessagePrefix}: ${error.message}`);
    // Log the full stack for better debugging
    logger.error(`Error stack: ${error.stack}`);
    throw error; // Re-throw the error to be handled by the caller
  }
}

/**
 * Fetches league data from the API, including the current season details.
 * @returns {Promise<Array<object>>} A promise that resolves with an array containing all fetched league data objects from all pages.
 */
export async function fetchAllLeagues() {
  return fetchAndCollectData(
    createFootballFetchCall,
    'leagues',
    'currentSeason',
    null, // No uniqueId needed for leagues
    'all external leagues'
  );
}

/**
 * Fetches detailed player data from the API for a specific player ID.
 * Includes player statistics.
 * @param {number} playerId - The ID of the player to fetch.
 * @returns {Promise<Array<object>>} A promise that resolves with an array containing the player's data along with statistics details and country info (usually a single object in an array).
 */
export async function fetchPlayers(playerId) {
  return fetchAndCollectData(
    createFootballFetchCall,
    'players',
    'statistics.details;country',
    playerId,
    `external player ID: ${playerId}`
  );
}

/**
 * Fetches detailed season data from the API for a specific season ID.
 * Includes associated teams and fixtures for that season.
 * @param {number} seasonId - The ID of the season to fetch.
 * @returns {Promise<Array<object>>} A promise that resolves with an array containing the season's data (usually a single object in an array).
 */
export async function fetchSeasons(seasonId) {
  return fetchAndCollectData(
    createFootballFetchCall,
    'seasons',
    'teams;fixtures',
    seasonId,
    `external season ID: ${seasonId}`
  );
}

/**
 * Fetches detailed club (team) data from the API for a specific club ID.
 * Includes the club's player roster.
 * @param {number} clubId - The ID of the club (team) to fetch.
 * @returns {Promise<Array<object>>} A promise that resolves with an array containing the club's data (usually a single object in an array).
 */
export async function fetchClubs(clubId) {
  return fetchAndCollectData(
    createFootballFetchCall,
    'teams',
    'players',
    clubId,
    `external club ID: ${clubId}`
  );
}

/**
 * Fetches detailed fixture data from the API for a specific fixture ID.
 * Includes lineup and participant information.
 * @param {number} fixtureId - The ID of the fixture to fetch.
 * @returns {Promise<Array<object>>} A promise that resolves with an array containing the fixture's data (usually a single object in an array).
 */
export async function fetchFixtures(fixtureId) {
  return fetchAndCollectData(
    createFootballFetchCall,
    'fixtures',
    'lineups;participants',
    fixtureId,
    `external fixture ID: ${fixtureId}`
  );
}

/**
 * Fetches a list of all data types (e.g., player types, injury types) from the Core API,
 * handling pagination automatically.
 * @returns {Promise<Array<object>>} A promise that resolves with an array containing all fetched type data objects from all pages.
 */
export async function fetchAllTypes() {
  return fetchAndCollectData(
    createCoreFetchCall,
    'types',
    null, // No includes
    null, // No uniqueId
    'all external types'
  );
}