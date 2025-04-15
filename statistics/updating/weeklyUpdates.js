import processClubRoster from '../players/processClubRoster.js';
import processFixtures from '../fixtures/processFixtures.js';
import { League, Club } from '../../schema/index.js';
import logger from '../../utils/logger.js';
import { fetchFixtures } from '../../utils/fetchFunctions.js';

export default async function updatePlayersAndFixtures() {
  try {
    const leagues = await League.find({});
    logger.info(`Found ${leagues.length} leagues to update players and fixtures`);

    for (const league of leagues) {
      await updateLeaguePlayersAndFixtures(league);
    }

    return true;
  } catch (error) {
    logger.error(`Error in updatePlayersAndFixtures: ${error.message})`);
    throw error;
  }
}

async function updateLeaguePlayersAndFixtures(league) {
  try {
    const clubs = await Club.find({league_id: league.league_id});
    logger.info(`Updating ${clubs.length} clubs for league: ${league.league_name}`);

    for (const club of clubs) {
      await updateClubRoster(club);
    }

    await updateLeagueFixtures();

    logger.info(`Successfully updated players and fixtures for league: ${league.league_name}`);
  } catch (error) {
    logger.error(`Error updating league ${league.league_name}: ${error.message}`);
    throw error;
  }
}

async function updateClubRoster(club) {
  try {
    logger.info(`Updating roster for club: ${club.club_name}`);
    const updatedRoster = await processClubRoster(club.club_id);
    logger.info(`Updated ${updatedRoster.length} players for ${club.club_name}`);
    return updatedRoster;
  } catch (error) {
    logger.error(`Error updating roster for club ${club.club_name}: ${error.message}`);
    throw error;
  }
}

async function updateLeagueFixtures(league) {
  try {
    logger.info(`Updating fixtures for league: ${league.league_name}`);
    const fixtureData = await fetchFixtures(league.season_id);
    const fixtures = await processFixtures(fixtureData.data.fixtures, league.league_id);
    logger.info(`Updated ${fixtures.length} fixtures for ${league.league_name}`);
    return fixtures;
  } catch (error) {
    logger.error(`Error updating fixtures for league ${league.league_name}: ${error.message}`);
    throw error;
  }
}