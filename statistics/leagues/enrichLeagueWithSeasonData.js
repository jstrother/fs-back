export default function enrichLeagueWithSeasonData(leagueInfo, seasonData) {
  const leagueSeasonDataString = seasonData.data.currentseason;

  return {
    ...leagueInfo,
    season_id: leagueSeasonDataString.id,
    season_name: leagueSeasonDataString.name,
    season_start: leagueSeasonDataString.starting_at,
    season_end: leagueSeasonDataString.ending_at,
  };
}