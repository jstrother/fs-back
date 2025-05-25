/**
 * @file Factory function for creating API fetch call handlers.
 * This module provides a higher-order function that generates specialized async functions
 * for making API requests, handling endpoint creation, pagination, and basic error logging.
 */
import { createFootballEndpointString, createCoreEndpointString } from './createEndpointString.js';
import logger from './logger.js';

/**
 * A higher-order function that returns an asynchronous function capable of making API calls
 * and handling pagination. It uses a provided `endpointCreator` to build the API URL.
 *
 * @param {function(string, string | null, number | null, number): string} endpointCreator - A function
 * (like `createFootballEndpointString` or `createCoreEndpointString`) that constructs the full API URL.
 * @returns {function(string, string | null, number | null, number, Array<any>): Promise<Array<any>>}
 * An async function that executes the fetch call.
 */
function createFetchCall(endpointCreator) {
  /**
   * Executes an API fetch call, handling pagination recursively.
   * This function is designed to be called by its parent `createFetchCall`'s returned closure.
   *
   * @param {string} specificEndpoint - The specific API path (e.g., 'leagues', 'seasons/123').
   * @param {string | null} [includes=null] - A comma or semicolon-separated string of related resources to include.
   * @param {number | null} [uniqueId=null] - A unique identifier for a specific resource.
   * @param {number} [page=1] - The current page number for paginated requests.
   * @param {Array<any>} [accumulatedData=[]] - An array to accumulate data across multiple paginated calls.
   * @returns {Promise<Array<any>>} A promise that resolves with an array of all fetched data, concatenated from all pages if pagination exists. Throws an error on fetch failure.
   */
  return async function fetchRecursive(specificEndpoint, includes = null, uniqueId = null, page = 1, accumulatedData = []) {
    try {
      const endpoint = endpointCreator(specificEndpoint, includes, uniqueId, page);
      const response = await fetch(endpoint);
      
      if (specificEndpoint === 'fixtures') {
        console.log(`createFetchCall response: `, response);
      }

      if (!response.ok) {
        logger.error(`HTTP error! Status ${response.status}`);
        throw new Error(`HTTP error! Status ${response.status}`);
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

      if (responseData.pagination?.has_more) {
        const nextPage = page + 1;
        const newData = [...accumulatedData, ...currentData];
        return fetchRecursive(specificEndpoint, includes, uniqueId, nextPage, newData);
      }

      const finalData = [...accumulatedData, ...currentData];
      return finalData;
    } catch (error) {
      logger.error(`Error creating fetch call: ${error}`);
      console.error(`Error creating fetch call: ${error.stack}`);
      throw error;
    }
  };
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