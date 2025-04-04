import createEndpointString from '../helpers/createEndpointString.js';

export default async function fetchPlayers() {
  const leagueData = await fetchLeagues();

  const leagueArray = leagueData.data.filter(league => league.sub_type === 'domestic');
  const leagueIDs = [];

  for (const league of leagueArray) {
    leagueIDs.push(league.id);
  }

  console.log(leagueIDs);
}

async function fetchLeagues() {
  try {
    const endpoint = await createEndpointString('leagues');
    
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! Status ${response.status}`);      
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error(`Error fetching leagues: ${error}`);
    throw error;
  }
}
