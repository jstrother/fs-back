export default function extractLeagueInfo(league) {
  return {
    league_id: league.id,
    league_country_id: league.country_id,
    league_name: league.name,
    league_short_code: league.short_code,
    league_logo: league.image_path,
  };
}