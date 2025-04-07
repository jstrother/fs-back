import createFetchCall from '../helpers/createFetchCall.js';

export default async function fetchPlayers() {
  const leagueData = await fetchLeagues();

  const leagueArray = leagueData.data.filter(league => league.sub_type === 'domestic');
  const leagueIDs = new Set();

  leagueArray.forEach(league => leagueIDs.add(league.id)); // we do this to make sure leagueArray stays an iterable for the first for...of loop


  for (const league of leagueArray) {
    const leagueInfo = {
      league_id: league.id,
      league_country_id: league.country_id,
      league_name: league.name,
      league_short_code: league.short_code,
      league_logo: league.image_path,
    }; 
    
    const leagueSeasonData = await fetchSpecificLeague(leagueInfo.league_id);
    const leagueSeasonDataString = leagueSeasonData.data.currentseason;
    const currentLeague = {
      ...leagueInfo,
      season_id: leagueSeasonDataString.id,
      season_name: leagueSeasonDataString.name,
      season_start: leagueSeasonDataString.starting_at,
      season_end: leagueSeasonDataString.ending_at,
    };
    
    const clubFixtureData = await fetchClubs(currentLeague.season_id);
    const clubFixtureDataString = clubFixtureData.data;
    const completeLeagueInfo = {
      ...currentLeague,
      clubs: [],
      fixtures: [],
    };

    for (const club of clubFixtureDataString.teams) {
      const currentClub = {
        club_id: club.id,
        club_country_id: club.country_id,
        club_venue_id: club.venue_id,
        club_name: club.name,
        club_short_code: club.short_code,
        club_logo: club.image_path,
        club_roster: [],
      };

      const rosterData = await fetchRoster(currentClub.club_id);
      for (const player of rosterData.data.players) {

      }

      completeLeagueInfo.clubs.push(currentClub);
    }

    for (const fixture of clubFixtureDataString.fixtures) {
      const currentFixture = {
        fixture_id: fixture.id,
        fixture_start: fixture.starting_at,
        fixture_name: fixture.name,
      };

      completeLeagueInfo.fixtures.push(currentFixture);
    }

    // console.log(completeLeagueInfo);
  }
}

async function fetchLeagues() {
  return createFetchCall('leagues');
}

async function fetchSpecificLeague(leagueId) {
  return createFetchCall('leagues', leagueId, 'currentSeason');
}

async function fetchClubs(seasonId) {
  return createFetchCall('seasons', seasonId, 'teams;fixtures');
}

async function fetchRoster(clubId) {
  return createFetchCall('teams', clubId, 'players');
}

async function fetchPlayer(playerId) {
  return createFetchCall('players', playerId, 'statistics;position');
}
