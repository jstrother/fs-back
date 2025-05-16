// This file is imported in:
// - /utils/fetchFunctions.js (for making API requests)

import { createFootballEndpointString, createCoreEndpointString } from './createEndpointString.js';
import logger from './logger.js';

function createFetchCall(endpointCreator) {
  return async function (specificEndpoint, includes = null, uniqueId = null, page = 1, accumulatedData = []) {
    try {
      const endpoint = endpointCreator(specificEndpoint, includes, uniqueId, page);
      const response = await fetch(endpoint);

      if (!response.ok) {
        const consoleMessage = await response.json();       
        console.log(consoleMessage);
        logger.error(`HTTP error! Status ${response.status}`);
      }

      const responseData = await response.json();
      const currentData = responseData.data || [];

      if (responseData.pagination?.has_more) {
        const nextPage = page + 1;
        const newData = [...accumulatedData, ...currentData];
        return this(specificEndpoint, includes, uniqueId, nextPage, newData);
      }

      const finalData = [...accumulatedData, ...currentData];
      return finalData;
    } catch (error) {
      logger.error(`Error creating fetch call: ${error}`);
      throw error;
    }
  };
}

export const createFootballFetchCall = createFetchCall(createFootballEndpointString);
export const createCoreFetchCall = createFetchCall(createCoreEndpointString);