import extractClubInfo from './extractClubInfo.js';
import processClubRoster from './processClubRoster.js';
import processFixtures from './processFixtures.js';

export default async function buildCompleteLeagueInfo(league, fixtureData) {
  const completeLeagueInfo = {
    ...league,
    clubs: [],
    fixtures: [],
  };

  for (const club of fixtureData) {
    const currentClub = await extractClubInfo(club, league.league_id);
    currentClub.club_roster = await processClubRoster(currentClub.club_id);
    completeLeagueInfo.clubs.push(currentClub);
  }

  completeLeagueInfo.fixtures = await processFixtures(fixtureData.fixtures, league.league_id);

  return completeLeagueInfo;
}