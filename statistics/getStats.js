// This file is imported in:
// - /statistics/updating/scheduledUpdates.js (for initial data loading)

import processLeague from './leagues/processLeague.js';
import { fetchLeagues } from '../utils/fetchFunctions.js';

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