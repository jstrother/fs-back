// This file is imported in:
// - /statistics/players/extractPlayerInfo.js (for enhancing player statistics with type information)

import logger from '../../utils/logger.js';
import Type from '../../schema/api/typeSchema.js';

export default async function enhancePlayerStatsWithTypeInfo(playerStatsResponse) {
  try {
    logger.info('Enhancing player statistics with type information');

    if (!playerStatsResponse?.data || !Array.isArray(playerStatsResponse)) {
      logger.error('Invalid player statistics data format');
      throw new Error('Invalid player statistics data format');
    }

    const typeIds = new Set();
    playerStatsResponse.data.forEach(playerStat => {
      if (playerStat.details && Array.isArray(playerStat.details)) {
        playerStat.details.forEach(detail => {
          if (detail.type_id) {
            typeIds.add(detail.type_id);
          }
        });
      }
    });

    logger.info(`Found ${typeIds.size} unique type_ids in player statistics`);

    const typeDefinitions = await Type.find({ id: { $in: Array.from(typeIds) } });

    const typeMap = new Map();
    typeDefinitions.forEach(type => {
      typeMap.set(type.id, {
        name: type.name,
        code: type.code,
        developer_name: type.developer_name,
        model_type: type.model_type,
        stat_group: type.stat_group,
      });
    });

    logger.info(`Retrieved ${typeDefinitions.length} type definitions from database`);

    const missingTypeIds = [];
    typeIds.forEach(id => {
      if (!typeMap.has(Number(id))) {
        missingTypeIds.push(id);
      }
    });

    if (missingTypeIds.length > 0) {
      logger.warn(`Missing type definitions for ${missingTypeIds.length} type_ids`, { missingTypeIds });
    }

    const enhancedData = playerStatsResponse.data.map(playerStat => {
      const enhancedPlayerStat = { ...playerStat };

      if (playerStat.details && Array.isArray(playerStat.details)) {
        enhancedPlayerStat.details = playerStat.details.map(detail => {
          const typeInfo = typeMap.get(Number(detail.type_id));

          return {
            ...detail,
            type_info: typeInfo || { missing: true, id: detail.type_id },
          };
        });
      }

      return enhancedPlayerStat;
    });

    return {
      ...playerStatsResponse,
      data: enhancedData,
      _meta: {
        processed: true,
        types_found: typeDefinitions.length,
        types_missing: missingTypeIds.length,
        missing_type_ids: missingTypeIds,
      },
    };
  } catch (error) {
    logger.error('Error enhancing player statistics', {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}