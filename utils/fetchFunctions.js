// This file is imported in:
// - /statistics/leagues/processLeague.js (for fetching league and club data)
// - /statistics/players/processClubRoster.js (for fetching player and roster data)
// - /statistics/updating/weeklyUpdates.js (for fetching fixture updates)
// - /statistics/updating/semiAnnualUpdates.js (for fetching league updates)

import createFetchCall from './createFetchCall.js';

export async function fetchLeagues() {
  return createFetchCall('leagues');
}

export async function fetchPlayer(playerId) {
  return createFetchCall('players', playerId, 'statistics;position');
}

export async function fetchRoster(clubId) {
  return createFetchCall('teams', clubId, 'players');
}

export async function fetchSpecificLeague(leagueId) {
  return createFetchCall('leagues', leagueId, 'currentSeason');
}

export async function fetchClubs(seasonId) {
  return createFetchCall('seasons', seasonId, 'teams;fixtures');
}

export async function fetchFixtures(seasonId) {
  return createFetchCall('seasons', seasonId, 'fixtures');
}