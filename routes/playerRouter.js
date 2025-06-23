/**
 * @file Express router for managing player data.
 * This module handles API endpoints related to fetching football player information.
 */
import express from 'express';
import { Player } from '../schema/index.js'; // Import the Player model
import authMiddleware from '../middleware/authMiddleware.js'; // Your authentication middleware
import logger from '../utils/logger.js';

const playerRouter = express.Router();

/**
 * @swagger
 * /api/players:
 * get:
 * summary: Get all available football players
 * description: Retrieves a list of all football players stored in the database.
 * tags:
 * - Players
 * security:
 * - BearerAuth: [] # Protecting this endpoint with authentication
 * responses:
 * 200:
 * description: A list of players.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Player' # Reference to your Player schema
 * 401:
 * description: Unauthorized - No token or invalid token.
 * 500:
 * description: Server error.
 */
playerRouter.get('/', authMiddleware, async (req, res) => {
  try {
    // Find all players in the database
    const players = await Player.find({}).populate('club');
    logger.info(`Backend: Fetched ${players.length} players.`);
    res.status(200).json(players);
  } catch (error) {
    logger.error(`Backend: Error fetching players: ${error.message}`);
    res.status(500).json({ message: 'Server error fetching players.' });
  }
});

export default playerRouter;