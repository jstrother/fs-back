// This file is imported in:
// - /utils/fetchFunctions.js (for making API requests)

import { createFootballEndpointString, createCoreEndpointString } from './createEndpointString.js';

export async function createFootballFetchCall(specificEndpoint, uniqueId = '', includes = '', page = 1, allData = []) {
  try {
    const endpoint = await createFootballEndpointString(specificEndpoint, uniqueId, includes);
    
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! Status ${response.status}`);      
    }

    const responseData = await response.json();

    allData = [...allData, ...responseData.data];
    if (responseData.pagination.has_more) {
      const nextPage = page + 1;
      console.log(allData);
      console.log(`Fetching next page: ${nextPage}`);
      return createFootballFetchCall(specificEndpoint, uniqueId, includes, nextPage, allData);
    }
    console.log(`Final allData: ${allData}`);
    return allData;
  } catch (error) {
    console.error(`Error fetching ${specificEndpoint}: ${error}`);
    throw error;
  }
}

export async function createCoreFetchCall(specificEndpoint, uniqueId = '', includes = '') {
  try {
    const endpoint = await createCoreEndpointString(specificEndpoint, uniqueId, includes);
    
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! Status ${response.status}`);      
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error(`Error fetching ${specificEndpoint}: ${error}`);
    throw error;
  }
}