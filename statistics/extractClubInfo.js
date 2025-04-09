import { Club } from '../schema/index.js';

export default async function extractClubInfo(club, leagueId) {
  const clubInfo = {
    club_id: club.id,
    club_country_id: club.country_id,
    club_venue_id: club.venue_id,
    club_name: club.name,
    club_short_code: club.short_code,
    club_logo: club.image_path,
    league_id: leagueId,
    updated_at: new Date(),
  };

  await Club.findOneAndUpdate(
    { club_id: clubInfo.club_id },
    clubInfo,
    {
      upsert: true,
      new: true,
    },
  );

  return clubInfo;
}