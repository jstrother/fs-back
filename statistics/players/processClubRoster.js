import extractPlayerInfo from './extractPlayerInfo.js';
import { fetchPlayer, fetchRoster } from '../../utils/fetchFunctions.js';

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