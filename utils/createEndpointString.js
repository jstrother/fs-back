/**
 * @file Utility functions for constructing API endpoint URLs for the football data provider.
 * This file centralizes the logic for building API request strings to ensure consistency.
 */
import { API_FOOTBALL_URL, API_CORE_URL, API_TOKEN } from '../config.js';

/**
 * A higher-order function that returns a specialized function for constructing API endpoints.
 * This allows for different base URLs to be pre-configured.
 *
 * @param {string} baseURL - The base URL for the API (e.g., 'https://api.example.com/football/').
 * @returns {function(string, string | null, number | null, number): string} A function that takes
 * `specificEndpoint`, `includes`, `uniqueId`, and `page` arguments to build a full URL.
 */
function createEndpointString(baseURL) {
  /**
   * Constructs a full API endpoint string based on the provided parameters.
   * This function is returned by `createEndpointString` with a pre-set `baseURL`.
   *
   * @param {string} specificEndpoint - The main part of the endpoint after the base URL (e.g., 'leagues', 'seasons/123').
   * @param {string | null} [includes=null] - A comma or semicolon-separated string of related resources to include (e.g., 'country;type').
   * @param {number | null} [uniqueId=null] - A unique identifier to append to the endpoint (e.g., a specific league ID).
   * @param {number} [page=1] - The page number for paginated results. Defaults to 1.
   * @returns {string} The complete API endpoint URL.
   */
  return function (specificEndpoint, includes = null, uniqueId = null, page = 1) {
    let endpoint = `${baseURL}${specificEndpoint}`;

    if (uniqueId) {
      endpoint += `/${uniqueId}`;
    }

    endpoint += API_TOKEN;

    if (includes) {
      endpoint += `&includes=${includes}`;
    }

    if (page > 1) {
      endpoint += `&page=${page}`;
    }

    return endpoint;
  };
}

/**
 * Creates an endpoint string for the Football API.
 * Uses `API_FOOTBALL_URL` as its base.
 * @function createFootballEndpointString
 * @param {string} specificEndpoint
 * @param {string | null} [includes=null]
 * @param {number | null} [uniqueId=null]
 * @param {number} [page=1]
 * @returns {string}
 */
export const createFootballEndpointString = createEndpointString(API_FOOTBALL_URL);

/**
 * Creates an endpoint string for the Core API.
 * Uses `API_CORE_URL` as its base.
 * @function createCoreEndpointString
 * @param {string} specificEndpoint
 * @param {string | null} [includes=null]
 * @param {number | null} [uniqueId=null]
 * @param {number} [page=1]
 * @returns {string}
 */
export const createCoreEndpointString = createEndpointString(API_CORE_URL);