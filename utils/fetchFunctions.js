// This file is imported in:
// - /db/saveLeagues.js (for saving leagues to the database - fetchAllLeagues)
// - /db/saveSeasons.js (for saving seasons to the database - fetchSeasons)
// - /db/saveClubs.js (for saving clubs to the database - fetchClubs)

import { createFootballFetchCall, createCoreFetchCall } from './createFetchCall.js';

export async function fetchAllLeagues() {
  return createFootballFetchCall('leagues', 'currentSeason');
}

export async function fetchAllPlayers() {
  return createFootballFetchCall('players', 'statistics');
}

export async function fetchSeasons(seasonId) {
  return createFootballFetchCall('seasons', 'teams;fixtures', seasonId);
}

export async function fetchClubs(clubId) {
  return createFootballFetchCall('teams', 'players', clubId);
}

export async function fetchFixtures(fixtureId) {
  return createFootballFetchCall('fixtures', 'lineups;participants', fixtureId);
}

export async function fetchStatistics(playerID) {
  return createFootballFetchCall('statistics/seasons/players', playerID);
}

export async function fetchCountries() {
  return createCoreFetchCall('countries');
}

export async function fetchCities() {
  return createCoreFetchCall('cities');
}

export async function fetchTypes() {
  return createCoreFetchCall('types');
}