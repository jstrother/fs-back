import { League } from '../schema/index.js';
import extractLeagueInfo from './extractLeagueInfo.js';
import enrichLeagueWithSeasonData from './enrichLeagueWithSeasonData.js';
import buildCompleteLeagueInfo from './buildCompleteLeagueInfo.js';
import createFetchCall from '../helpers/createFetchCall.js';


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

async function fetchSpecificLeague(leagueId) {
  return createFetchCall('leagues', leagueId, 'currentSeason');
}

async function fetchClubs(seasonId) {
  return createFetchCall('seasons', seasonId, 'teams;fixtures');
}