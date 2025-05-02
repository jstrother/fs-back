// This file is imported in:
// - /statistics/updating/scheduledUpdates.js (for initial data loading)

import { fetchAllLeagues } from '../utils/fetchFunctions.js';

export default async function getStats() {
  try {
    const leagueData = await fetchAllLeagues();
    const leagueArray = leagueData.data.filter(league => league.sub_type === 'domestic');

    return leagueArray;
  } catch (error) {
    console.error(`Error in getStats: ${error}`);
    throw error;
  }
}