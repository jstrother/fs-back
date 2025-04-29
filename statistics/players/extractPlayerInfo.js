// This file is imported in:
// - /statistics/updating/weeklyUpdates.js (for processing player updates)
// - /statistics/getStats.js (for initial data loading)

import { Player } from '../../schema/index.js';

export default async function extractPlayerInfo(playerData, clubId) {
  const playerInfo = {
    player_id: playerData.id,
    player_first_name: playerData.firstname,
    player_last_name: playerData.lastname,
    player_common_name: playerData.common_name,
    player_name: playerData.name,
    player_display_name: playerData.display_name,
    player_image: playerData.image_path,
    player_country_id: playerData.country_id,
    player_nationality_id: playerData.nationality_id,
    player_position: playerData.position.name,
    player_jersey_number: playerData.statistics.jersey_number,
    player_club: clubId,
    player_stats: {},
    updated_at: new Date(),
  };

  await Player.findOneAndUpdate(
    { player_id: playerInfo.player_id },
    playerInfo,
    {
      upsert: true,
      new: true,
    }
  );

  return playerInfo;
}