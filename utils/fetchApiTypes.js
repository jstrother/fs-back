import { API_TOKEN } from '../config.js';
import logger from './logger.js';
import Type from '../schema/api/typeSchema.js';

export default async function fetchApiTypes() {
  const TYPES_URL = `https://api.sportmonks.com/v3/core/types?api_token=${API_TOKEN}`;

  let allTypes = [];
  let page = 1;
  let hasMore = true;

  logger.info('Starting to fetch all TYPES from API');

  while (hasMore) {
    try {
      logger.debug(`Fetching page ${page} of TYPES`);
      const response = await fetch(`${TYPES_URL}&page=${page}`);

      if (!response.ok) {
        const errorMessage = `API request failed with status ${request.status}`;
        logger.error(errorMessage, {
          page,
          status: response.status,
        });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const typesData = data.data;
      const paginationData = data.pagination;

      if (typesData && Array.isArray(typesData)) {
        const pageTypesCount = typesData.length;

        allTypes = [...allTypes, ...typesData];

        await updateTypesDatabase(typesData);

        logger.info(`Added ${pageTypesCount} TYPES from page ${page}`, {
          page,
          count: pageTypesCount,
          totalSoFar: allTypes.length,
        });
      } else {
        logger.warn(`Received unexpected data structure from API on page ${page}`);
      }

      hasMore = paginationData && paginationData.has_more;
      page++;
    } catch (error) {
      logger.error('Error fetching TYPES', {
        error: error.message,
        page,
        stack: error.stack,
      });
      break;
    }
  }

  logger.info(`Successfully fetched all TYPES: ${allTypes.length} total TYPES`);
  return allTypes;
}

async function updateTypesDatabase(types) {
  try {
    const bulkOps = types.map(type => ({
      updateOne: {
        filter: {
          id: type.id,
        },
        update: {
          $set: {
            name: type.name,
            code: type.code,
            developer_name: type.developer_name,
            model_type: type.model_type,
            stat_group: type.stat_group,
          },
        },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      const result = await Type.bulkWrite(bulkOps);
      logger.info('Database update of TYPES completed', {
        matched: result.matchedCount,
        modified: result.modifiedCount,
        upserted: result.upsertedCount,
      });
    }
  } catch (error) {
    logger.error('Error updating database with TYPES', {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}