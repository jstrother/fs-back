/**
 * @file Contains specific API fetch functions for various football and core entities.
 * These functions abstract the `createFootballFetchCall` and `createCoreFetchCall`
 * to handle data extraction and provide a clear interface for fetching different data types.
 */
import { createFootballFetchCall, createCoreFetchCall } from './createFetchCall.js';

/**
 * Fetches league data from the API, including the current season details.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of league data objects.
 */
export async function fetchAllLeagues() {
  return createFootballFetchCall('leagues', 'currentSeason');
}

/**
 * Fetches detailed player data from the API for a specific player ID.
 * Includes player statistics.
 * @param {number} playerId - The ID of the player to fetch.
 * @returns {Promise<Array<object>>} A promise that resolves with an array containing the player's data.
 */
export async function fetchPlayers(playerId) {
  return createFootballFetchCall('players', 'statistics', playerId);
}

/**
 * Fetches detailed season data from the API for a specific season ID.
 * Includes associated teams and fixtures for that season.
 * @param {number} seasonId - The ID of the season to fetch.
 * @returns {Promise<Array<object>>} A promise that resolves with an array containing the season's data.
 */
export async function fetchSeasons(seasonId) {
  return createFootballFetchCall('seasons', 'teams;fixtures', seasonId);
}

/**
 * Fetches detailed club (team) data from the API for a specific club ID.
 * Includes the club's player roster.
 * @param {number} clubId - The ID of the club (team) to fetch.
 * @returns {Promise<Array<object>>} A promise that resolves with an array containing the club's data.
 */
export async function fetchClubs(clubId) {
  return createFootballFetchCall('teams', 'players', clubId);
}

/**
 * Fetches detailed fixture data from the API for a specific fixture ID.
 * Includes lineup and participant information.
 * @param {number} fixtureId - The ID of the fixture to fetch.
 * @returns {Promise<Array<object>>} A promise that resolves with an array containing the fixture's data.
 */
export async function fetchFixtures(fixtureId) {
  return createFootballFetchCall('fixtures', 'lineups;participants', fixtureId);
}


/**
 * Fetches seasonal statistics for players from the API.
 * @param {number} [playerID] - The player ID to filter statistics for.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of player statistics data.
 */
export async function fetchStatistics(playerID) {
  return createFootballFetchCall('statistics/seasons/players', playerID);
}

/**
 * Fetches a list of all countries from the Core API.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of country data objects.
 */
export async function fetchCountries() {
  return createCoreFetchCall('countries');
}

/**
 * Fetches a list of all cities from the Core API.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of city data objects.
 */
export async function fetchCities() {
  return createCoreFetchCall('cities');
}

/**
 * Fetches a list of all data types (e.g., player types, injury types) from the Core API.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of type data objects.
 */
export async function fetchTypes() {
  return createCoreFetchCall('types');
}