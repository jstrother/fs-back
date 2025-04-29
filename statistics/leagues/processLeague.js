// This file is imported in:
// - /statistics/getStats.js (for initial league processing)
// - /statistics/updating/semiAnnualUpdates.js (for updating league data)

import { League } from '../../schema/index.js';
import { fetchSpecificLeague, fetchClubs } from '../../utils/fetchFunctions.js';
import extractLeagueInfo from './extractLeagueInfo.js';
import enrichLeagueWithSeasonData from './enrichLeagueWithSeasonData.js';
import buildCompleteLeagueInfo from './buildCompleteLeagueInfo.js';


export default async function processLeague(league) {
  const leagueInfo = extractLeagueInfo(league);

  const leagueSeasonData = await fetchSpecificLeague(leagueInfo.league_id);
  const currentLeague = enrichLeagueWithSeasonData(leagueInfo, leagueSeasonData);

  await League.findOneAndUpdate(
    { league_id: currentLeague.league_id },
    currentLeague,
    {
      upsert: true,
      new: true,
    },
  );

  const clubFixtureData = await fetchClubs(currentLeague.season_id);
  const clubFixtureDataString = clubFixtureData.data;

  return await buildCompleteLeagueInfo(currentLeague, clubFixtureDataString);
}

