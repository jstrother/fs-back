import mongoose from 'mongoose';
import { SyncStatus } from '../schema/index.js';
import logger from './logger.js';

const SYNC_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export async function shouldSync(entityType) {
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

export async function updateSyncStatus(entityType) {
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