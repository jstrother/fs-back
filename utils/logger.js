/**
 * @file Centralized logging utility for the application.
 * Configures Winston to handle different log levels (info, warn, error)
 * and directs output to files (error.log, combined.log) and the console
 * (in non-production environments).
 */
import winston from 'winston';

/**
 * The Winston logger instance configured for the application.
 * It provides methods like `logger.info()`, `logger.warn()`, `logger.error()`
 * for logging messages at various levels.
 *
 * @type {winston.Logger}
 */
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

/**
 * Exports the configured Winston logger instance as the default export.
 * @exports default logger
 */
export default logger;