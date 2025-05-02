// This file is imported in:
// - /utils/fetchFunctions.js (for building API endpoints)

import { API_FOOTBALL_URL, API_TOKEN } from '../config.js';

// if there are more than one value for includes, pass them as a single string with each value separated by a semi-colon
// for example: 'teams;fixtures'
export async function createFootballEndpointString(specificEndpoint, uniqueId = '', includes = '', page = 1) {
  let endpoint = `${API_FOOTBALL_URL}${specificEndpoint}`;

  if (uniqueId) {
    endpoint += `/${uniqueId}`;
  }

  endpoint += API_TOKEN;

  if (includes) {
    endpoint += `&includes=${includes}`;
  }

  endpoint += `&page=${page}`;

  return endpoint;
}

export async function createCoreEndpointString(specificEndpoint, uniqueId = '', includes = '', page = 1) {
  let endpoint = `${API_CORE_URL}${specificEndpoint}`;

  if (uniqueId) {
    endpoint += `/${uniqueId}`;
  }

  endpoint += API_TOKEN;

  if (includes) {
    endpoint += `&includes=${includes}`;
  }

  endpoint += `&page=${page}`;

  return endpoint;
}