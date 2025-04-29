// This file is imported in:
// - /statistics/leagues/processLeague.js (for extracting basic league information)
// - /statistics/updating/semiAnnualUpdates.js (for updating league data)

export default function extractLeagueInfo(league) {
  return {
    league_id: league.id,
    league_country_id: league.country_id,
    league_name: league.name,
    league_short_code: league.short_code,
    league_logo: league.image_path,
  };
}