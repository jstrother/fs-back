import createEndpointString from './createEndpointString.js';

export default async function createFetchCall(specificEndpoint, uniqueId = '', includes = '') {
  try {
      const endpoint = await createEndpointString(specificEndpoint, uniqueId, includes);
      
      const response = await fetch(endpoint);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status ${response.status}`);      
      }
  
      const data = await response.json();
  
      return data;
  
    } catch (error) {
      console.error(`Error fetching leagues: ${error}`);
      throw error;
    }
}