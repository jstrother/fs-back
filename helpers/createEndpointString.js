import { API_BASE_URL, API_TOKEN } from '../config.js';

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