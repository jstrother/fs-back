// This file is imported in:
// - /utils/fetchFunctions.js (for API request logging)
// - /utils/fetchApiTypes.js (for type fetching logs)
// - /statistics/updating/scheduledUpdates.js (for update logging)
// - /statistics/updating/weeklyUpdates.js (for weekly update logs)
// - /statistics/updating/semiAnnualUpdates.js (for semi-annual update logs)
// - /statistics/players/enhancePlayerStatsWithTypeInfo.js (for player stats logging)
// - /schema/index.js (for database connection logging)

import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: {
    service: 'sportmonks api',
  },
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

// console logging for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }));
}

export default logger;