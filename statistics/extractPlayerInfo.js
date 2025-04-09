import { Player } from '../schema/index.js';

export default async function extractPlayerInfo(playerData, clubId) {
  const playerInfo = {
    player_id: playerData.id,
    player_country_id: playerData.country_id,
    player_nationality_id: playerData.nationality_id,
    player_position: playerData.position.name,
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