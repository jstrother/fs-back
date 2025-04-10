import extractPlayerInfo from './extractPlayerInfo.js';
import createFetchCall from '../../helpers/createFetchCall.js';

export default async function processClubRoster(clubId) {
  const rosterData = await fetchRoster(clubId);
  const roster = [];

  for (const player of rosterData.data.players) {
    const playerData = await fetchPlayer(player.player_id);
    const playerInfo = await extractPlayerInfo(playerData.data, clubId);
    roster.push(playerInfo);
  }

  return roster;
}

async function fetchPlayer(playerId) {
  return createFetchCall('players', playerId, 'statistics;position');
}

async function fetchRoster(clubId) {
  return createFetchCall('teams', clubId, 'players');
}