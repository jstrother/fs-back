import { API_BASE_URL, API_TOKEN } from '../config';
import createLoopedTimer from '../helpers/createLoopedTimer';

export default async function fetchPlayers() {

}

async function createEndpointString(specificEndpoint, uniqueId, includes = '') {
  if (typeof specificEndpoint !== 'string' || typeof uniqueId !== 'number' || typeof includes !== 'string') {
    return null;
  }

  let uri = '';

  if (includes) {
    uri = `${API_BASE_URL}${specificEndpoint}/${uniqueId}?api_token=${API_TOKEN}&includes=${includes}`;
  } else {
    uri = `${API_BASE_URL}${specificEndpoint}/${uniqueId}?api_token=${API_TOKEN}`;
  }

  return uri;
}

// https://api.sportmonks.com/v3/football/players?api_token=YOUR_TOKEN