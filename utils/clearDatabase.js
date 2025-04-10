import mongoose from 'mongoose';
import logger from './logger.js';

export default async function clearDatabase() {
  try {
    await mongoose.connection.dropDatabase();
    logger.info('Database cleared');
  } catch (error) {
    logger.error(`Error clearing database: ${error}`);
  }
}