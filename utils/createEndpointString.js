// This file is imported in:
// - /utils/fetchFunctions.js (for building API endpoints)

import { API_FOOTBALL_URL, API_CORE_URL, API_TOKEN } from '../config.js';

// if there are more than one value for includes, pass them as a single string with each value separated by a semi-colon
// for example: 'teams;fixtures'

function createEndpointString(baseURL) {
  return function (specificEndpoint, uniqueId = '', includes = '', page = 1) {
    let endpoint = `${baseURL}${specificEndpoint}`;

    if (uniqueId) {
      endpoint += `/${uniqueId}`;
    }

    endpoint += API_TOKEN;

    if (includes) {
      endpoint += `&includes=${includes}`;
    }

    endpoint += `&page=${page}`;

    return endpoint;
  };
}

export const createFootballEndpointString = createEndpointString(API_FOOTBALL_URL);
export const createCoreEndpointString = createEndpointString(API_CORE_URL);