// This file is imported in:
// - /statistics/updating/weeklyUpdates.js (for processing player updates)
// - /statistics/getStats.js (for initial data loading)

import { Player } from '../../schema/index.js';
import enhancePlayerStatsWithTypeInfo from './enhancePlayerStatsWithTypeInfo.js';

export default async function extractPlayerInfo(playerData, clubId) {
  let enhancedStats = {};
  if (playerData.statistics && Object.keys(playerData.statistics).length > 0) {
    try {
      const details = Array.isArray(playerData.statistics.details) 
        ? playerData.statistics.details 
        : [];

      const statsResponse = {
        data: [
          {
            details: details.filter(detail => detail && detail.type_id)
          },
        ],
      };

      if (statsResponse.data[0].details.length > 0) {
        const enhancedStatsResponse = await enhancePlayerStatsWithTypeInfo(statsResponse);

        if (enhancedStatsResponse?.data?.[0]?.details) {
          enhancedStats = {
            ...playerData.statistics,
            details: enhancedStatsResponse.data[0].details,
          };
        }
      } else {
        enhancedStats = playerData.statistics;
      }
    } catch (error) {
      console.error('Error enhancing player statistics:', error);
      enhancedStats = playerData.statistics || {};
    }
  }
  
  const playerInfo = {
    player_id: playerData.id,
    firstName: playerData.firstname,
    lastName: playerData.lastname,
    commonName: playerData.common_name,
    player_country_id: playerData.country_id,
    player_nationality_id: playerData.nationality_id,
    nationality: playerData.nationality || '',
    player_position: playerData.position?.name || '',
    player_club_id: clubId,
    jerseyNumber: playerData.jersey_number || null,
    stats: enhancedStats,
    updated_at: new Date()
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