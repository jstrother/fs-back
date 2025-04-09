import createFetchCall from '../helpers/createFetchCall.js';
import saveLeagueIDS from './saveLeagueIDs.js';

export default async function getLeagueInfo() {
  const leagueData = await fetchLeagues();

  const leagueArray = leagueData.data.filter(league => league.sub_type === 'domestic');  

  leagueArray.forEach(league => saveLeagueIDS.add(league.id)); // we do this to make sure leagueArray stays an iterable for the first for...of loop

  for (const league of leagueArray) {
    
  }
}

async function fetchLeagues() {
  return createFetchCall('leagues');
}