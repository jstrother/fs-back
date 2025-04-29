// This file is imported in:
// - /statistics/leagues/processLeague.js (for processing league fixtures)
// - /statistics/updating/weeklyUpdates.js (for updating fixture information)

import { Fixture } from '../../schema/index.js';

export default async function processFixtures(fixturesData, leagueId) {
  const fixtures = [];

  for (const fixture of fixturesData) {
    const fixtureInfo = {
      fixture_id: fixture.id,
      fixture_start: fixture.starting_at,
      fixture_name: fixture.name,
      league_id: leagueId,
      updated_at: new Date(),
    };

    await Fixture.findOneAndUpdate(
      { fixture_id: fixtureInfo.fixture_id },
      fixtureInfo,
      {
        upsert: true,
        new: true,
      },
    );

    fixtures.push(fixtureInfo);
  }

  return fixtures;
}