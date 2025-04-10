import processLeague from './leagues/processLeague.js';
import createFetchCall from '../helpers/createFetchCall.js';

export default async function getStats() {
  try {
    const leagueData = await fetchLeagues();
    const leagueArray = leagueData.data.filter(league => league.sub_type === 'domestic');

    const processedLeagues = [];

    for (const league of leagueArray) {
      const processedLeague = await processLeague(league);
      processedLeagues.push(processedLeague);
    }

    return processedLeagues;
  } catch (error) {
    console.error(`Error in getStats: ${error}`);
    throw error;
  }
}

async function fetchLeagues() {
  return createFetchCall('leagues');
}