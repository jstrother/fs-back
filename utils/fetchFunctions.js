// This file is imported in:
// - /statistics/leagues/processLeague.js (for fetching league and club data)
// - /statistics/players/processClubRoster.js (for fetching player and roster data)
// - /statistics/updating/weeklyUpdates.js (for fetching fixture updates)
// - /statistics/updating/semiAnnualUpdates.js (for fetching league updates)

import { createFootballFetchCall } from './createFetchCall.js';

export async function fetchAllLeagues() {
  return createFootballFetchCall('leagues');
}

export async function fetchAllPlayers() {
  return createFootballFetchCall('players');
}

export async function fetchPlayer(playerId) {
  return createFootballFetchCall('players', playerId, 'statistics;position');
}

export async function fetchRoster(clubId) {
  return createFootballFetchCall('teams', clubId, 'players');
}

export async function fetchSpecificLeague(leagueId) {
  return createFootballFetchCall('leagues', leagueId, 'currentSeason');
}

export async function fetchClubs(seasonId) {
  return createFootballFetchCall('seasons', seasonId, 'teams;fixtures');
}

export async function fetchFixtures(seasonId) {
  return createFootballFetchCall('seasons', seasonId, 'fixtures');
}