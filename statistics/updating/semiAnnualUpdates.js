import { fetchLeagues, fetchSpecificLeague, fetchClubs } from '../../utils/fetchFunctions.js';
import extractLeagueInfo from '../leagues/extractLeagueInfo.js';
import enrichLeagueWithSeasonData from '../leagues/enrichLeagueWithSeasonData.js';
import extractClubInfo from '../clubs/extractClubInfo.js';
import { League, Club } from '../../schema/index.js';
import logger from '../../utils/logger.js';

export default async function updateLeaguesAndClubs() {
  try {
    const leagueData = await fetchLeagues();
    const leagueArray = leagueData.data.filter(league => league.sub_type === 'domestic');

    logger.info(`Found ${leagueArray.length} leagues to update`);

    for (const league of leagueArray) {
      await updateLeagueAndItsClubs();
    }
    return true;
  } catch (error) {
    logger.error(`Error in updateLeaguesAndClubs: ${error.message}`);
    throw error;
  }
}

async function updateLeagueAndItsClubs(league) {
  try {
    const leagueInfo = extractLeagueInfo(league);
    const leagueSeasonData = await fetchSpecificLeague(leagueInfo.league_id);
    const updatedLeague = enrichLeagueWithSeasonData(leagueInfo, leagueSeasonData);

    await League.findOneAndUpdate(
      { league_id: updatedLeague.league_id },
      updatedLeague,
      {
        upsert: true,
        new: true,
      },
    );

    await updateClubsForLeague(updatedLeague);

    logger.info(`Successfully updated league: ${updatedLeague.league_name} with new season data`);
    
    return updatedLeague;
  } catch (error) {
    logger.error(`Error updating league ${league.name}: ${error.message}`);
    throw error;
  }
}

async function updateClubsForLeague(league) {
  try {
    logger.info(`Updating clubs for league ${league.league_name}`);

    const clubData = await fetchClubs(league.season_id);
    const clubs = clubData.data.teams;
    const updatedClubs = [];

    for (const club of clubs) {
      const clubInfo = await extractClubInfo(club, league.league_id);
      updatedClubs.push(clubInfo);
    }

    logger.info(`Updated ${updatedClubs.length} clubs for ${league.league_name}`);

    return updatedClubs;
  } catch (error) {
    logger.error(`Error updating clubs for league ${league.league_name}: ${error.message}`);
    throw error;
  }
}