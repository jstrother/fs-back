// This file is imported in:
// - /utils/fetchFunctions.js (for making API requests)

import { createFootballEndpointString, createCoreEndpointString } from './createEndpointString.js';

function createFetchCall(endpointCreator) {
  return async function (specificEndpoint, includes = '', uniqueId = '', page = 1, accumulatedData = []) {
    try {
      const endpoint = endpointCreator(specificEndpoint, uniqueId, includes, page);
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP error! Status ${response.status}`);
      }

      const responseData = await response.json();
      const currentData = responseData.data || [];

      if (responseData.pagination.has_more) {
        const nextPage = page + 1;
        const newData = [...accumulatedData, ...currentData];
        return this(specificEndpoint, uniqueId, includes, nextPage, newData);
      }

      const finalData = [...accumulatedData, ...currentData];
      return finalData;
    } catch (error) {
      console.error(`Error creating fetch call: ${error}`);
      throw error;
    }
  };
}

export const createFootballFetchCall = createFetchCall(createFootballEndpointString);
export const createCoreFetchCall = createFetchCall(createCoreEndpointString);