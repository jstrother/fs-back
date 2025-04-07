import createFetchCall from '../helpers/createFetchCall.js';

export default async function fetchPlayers() {
  const leagueData = await fetchLeagues();

  const leagueArray = leagueData.data.filter(league => league.sub_type === 'domestic');
  const leagueIDs = new Set();

  leagueArray.forEach(league => leagueIDs.add(league.id)); // we do this to make sure leagueArray stays an iterable for the first for...of loop
  
  console.log(leagueIDs);


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
    console.log(currentLeague);
  }
}

async function fetchLeagues() {
  return createFetchCall('leagues');
}

async function fetchSpecificLeague(id) {
  return createFetchCall('leagues', id, 'currentSeason');
}
