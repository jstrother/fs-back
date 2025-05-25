/**
 * @file Manages the synchronization logic for various data entities, including rate limiting and status updates.
 * This module provides functions to determine if a sync is needed, update sync timestamps,
 * and orchestrate the full synchronization process for a given entity type.
 * It ensures that data fetching from external APIs respects defined intervals to prevent excessive requests.
 */

import mongoose from 'mongoose';
import { SyncStatus } from '../schema/index.js';
import logger from './logger.js';

const SYNC_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Checks if a particular entity type should be synced based on its last sync timestamp.
 * An entity should be synced if it has never been synced or if the last sync was
 * more than SYNC_INTERVAL_MS ago.
 *
 * @param {string} entityType - The type of entity (e.g., 'leagues', 'seasons', 'clubs', 'fixtures', 'players').
 * @returns {Promise<boolean>} - True if the entity should be synced, false otherwise.
 */
async function shouldSync(entityType) {
  try {
    const status = await SyncStatus.findOne({ entity_type: entityType });

    if (!status) {
      logger.info(`No sync status found for ${entityType}. Syncing...`);
      return true;
    }

    if (!status.last_synced_at) {
      logger.info(`No last synced date found for ${entityType}. Syncing...`);
      return true;
    }

    const lastSyncedAt = status.last_synced_at.getTime();
    const currentTime = Date.now();
    const timeSinceLastSync = currentTime - lastSyncedAt;

    if (timeSinceLastSync >= SYNC_INTERVAL) {
      logger.info(`Last synced ${entityType} over 7 days ago. Syncing...`);
      return true;
    } else {
      logger.info(`Last synced ${entityType} less than 7 days ago. No sync needed.`);
      return false;
    }
  } catch (error) {
    logger.error(`Error checking sync status for ${entityType}: ${error.message}`);
    return true; // Default to syncing on error
  }
}

/**
 * Updates the last sync timestamp for a given entity type to the current time.
 * If an entry for the entity type does not exist, it creates one.
 *
 * @param {string} entityType - The type of entity (e.g., 'leagues', 'seasons', 'clubs', 'fixtures', 'players').
 * @returns {Promise<void>}
 */
async function updateSyncStatus(entityType) {
  try {
    const status = await SyncStatus.findOneAndUpdate(
      { entity_type: entityType },
      { $set: { last_synced_at: new Date() } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (status) {
      logger.info(`Updated sync status for ${entityType} to ${status.last_synced_at}`);
    } else {
      logger.warn(`Failed to update sync status for ${entityType}`);
    }
  } catch (error) {
    logger.error(`Error updating sync status for ${entityType}: ${error.message}`);
  }
}

/**
 * A generic function to handle the conditional syncing of different data entities.
 * It checks the sync status, fetches IDs if necessary, calls the save function,
 * and updates the sync status.
 *
 * @param {string} entityType - The type of entity (e.g., 'leagues', 'seasons', 'clubs', 'fixtures', 'players').
 * @param {Function} saveFunction - The async function responsible for saving/updating the entity data (e.g., saveLeagues, saveSeasons).
 * This function will be called with `ids` if provided, or without if no IDs are needed.
 * @param {Function} [idGetterFunction=null] - An optional async function that retrieves an array of IDs needed by the saveFunction
 * (e.g., getSavedSeasonIDs, getClubIDsFromSeasons).
 * @returns {Promise<void>}
 */
export default async function dataSyncHandler(entityType, saveFunction, idGetterFunction = null) {
  let ids = [];

  if (idGetterFunction) {
    try {
      ids = await idGetterFunction();
      if (!ids || ids.length === 0) {
        logger.warn(`No ${entityType} IDs found. Skipping ${entityType} data fetching.`);
        return;
      }

      logger.info(`Retrieved ${ids.length} IDs for ${entityType}`);
    } catch (error) {
      logger.error(`Error retrieving ${entityType} IDs: ${error.message}`);
      return;
    }
  }

  if (await shouldSync(entityType)) {
    logger.info(`Initiating ${entityType} syncing...`);
    try {
      if (idGetterFunction) {
        await saveFunction(ids);
      } else {
        await saveFunction();
      }

      await updateSyncStatus(entityType);
      logger.info(`Successfully completed ${entityType} syncing.`);
    } catch (error) {
      logger.error(`Error during ${entityType} sync process: ${error.message}`);
      // Log the error, but do not re-throw. Allow other sync processes to continue
      // Let the individual sync functions throw their own errors for more granular handling
    }
  }
}