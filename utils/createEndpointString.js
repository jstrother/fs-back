import { API_BASE_URL, API_TOKEN } from '../config.js';

// if there are more than one value for includes, pass them as a single string with each value separated by a semi-colon
// for example: 'teams;fixtures'
export default async function createEndpointString(specificEndpoint, uniqueId = '', includes = '') {
  let endpoint = `${API_BASE_URL}${specificEndpoint}`;

  if (uniqueId) {
    endpoint += `/${uniqueId}`;
  }

  endpoint += `?api_token=${API_TOKEN}`;

  if (includes) {
    endpoint += `&includes=${includes}`;
  }

  return endpoint;
}