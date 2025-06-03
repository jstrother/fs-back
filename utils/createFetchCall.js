/**
 * @file Factory function for creating API fetch call handlers.
 * This module provides a higher-order function that generates specialized async functions
 * for making API requests, handling endpoint creation, pagination, and basic error logging.
 */
import fetch from 'node-fetch';
import { createFootballEndpointString, createCoreEndpointString } from './createEndpointString.js';
import { SPORTMONKS_API_KEY } from '../config.js';
import logger from './logger.js';

/**
 * A higher-order function that returns an asynchronous function capable of making API calls
 * and handling pagination. It uses a provided `endpointCreator` to build the API URL.
 *
 * @param {function(string, string | null, number | null, number): string} endpointCreator - A function
 * (like `createFootballEndpointString` or `createCoreEndpointString`) that constructs the full API URL.
 * @returns {function(string, string | null, number | null): AsyncGenerator<any, void, void>}
 * An async generator function that fetches data page by page and yields individual items.
 * The returned generator takes `specificEndpoint`, `includes`, and `uniqueId` as arguments.
 */
function createFetchCall(endpointCreator) {
  /**
   * An asynchronous generator function that fetches data from a paginated API endpoint.
   * This function fetches data page by page and yields individual items as they are received.
   *
   * @param {string} specificEndpoint - The main part of the endpoint after the base URL (e.g., 'leagues', 'seasons/123').
   * @param {string | null} [includes=null] - An optional semicolon-separated string of related resources to include.
   * @param {number | null} [uniqueId=null] - An optional unique identifier for a specific resource.
   * @returns {AsyncGenerator<any, void, void>} An async generator that yields individual data items.
   * @throws {Error} If the API call fails (e.g., network error, non-OK HTTP status).
   */
  return async function* fetchPaginatedData(specificEndpoint, includes = null, uniqueId = null) {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        let endpoint = endpointCreator(specificEndpoint, includes, uniqueId, page);

        const separator = endpoint.includes('?') ? '&' : '?';
        endpoint = `${endpoint}${separator}api_token=${SPORTMONKS_API_KEY}`;

        logger.info(`Fetching data from endpoint: ${endpoint}`);

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorMsg = `HTTP error! Status ${response.status} for ${endpoint}`;
          logger.error(errorMsg);
          throw new Error(errorMsg);
        }

        const responseData = await response.json();
        let currentData;

        if (Array.isArray(responseData.data)) {
          // If the data is an array, use it directly
          currentData = responseData.data;
        } else if (responseData.data) {
          // If the data is an object, wrap it in an array
          currentData = [responseData.data];
        } else {
          // If there's no data, set currentData to an empty array
          currentData = [];
        }

        for (const item of currentData) {
          yield item; // Yield each item individually
        }

        hasMore = responseData.pagination?.has_more || false;

        if (hasMore) {
          page++; // Increment the page for the next iteration
        }
        logger.info(`Fetched ${currentData.length} items from page ${page - 1}`);

      } catch (error) {
        logger.error(`Error creating fetch call for page ${page}: ${error.message}`);
        console.error(`Error creating fetch call: ${error.stack}`);
        throw error;
      }
    }    
  }
}

/**
 * An asynchronous function specialized for fetching data from the Football API.
 * This is created by pre-configuring `createFetchCall` with `createFootballEndpointString`.
 *
 * @function createFootballFetchCall
 * @param {string} specificEndpoint - The specific API path (e.g., 'leagues', 'seasons/123').
 * @param {string | null} [includes=null] - A comma or semicolon-separated string of related resources to include.
 * @param {number | null} [uniqueId=null] - A unique identifier for a specific resource.
 * @param {number} [page=1] - The current page number for paginated requests.
 * @returns {Promise<Array<any>>} A promise that resolves with an array of all fetched data.
 */
export const createFootballFetchCall = createFetchCall(createFootballEndpointString);


/**
 * An asynchronous function specialized for fetching data from the Core API.
 * This is created by pre-configuring `createFetchCall` with `createCoreEndpointString`.
 *
 * @function createCoreFetchCall
 * @param {string} specificEndpoint - The specific API path (e.g., 'cities', 'countries/123').
 * @param {string | null} [includes=null] - A comma or semicolon-separated string of related resources to include.
 * @param {number | null} [uniqueId=null] - A unique identifier for a specific resource.
 * @param {number} [page=1] - The current page number for paginated requests.
 * @returns {Promise<Array<any>>} A promise that resolves with an array of all fetched data.
 */
export const createCoreFetchCall = createFetchCall(createCoreEndpointString);