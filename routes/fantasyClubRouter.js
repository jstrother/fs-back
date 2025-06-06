// routes/fantasyClubRouter.js

/**
 * @file Express router for managing fantasy clubs.
 * This module handles API endpoints related to creating and managing fantasy clubs.
 */
import express from 'express';
import { FantasyClub } from '../schema/index.js'; // Import the FantasyClub model
import authMiddleware from '../middleware/authMiddleware.js'; // Your authentication middleware
import logger from '../utils/logger.js';

const fantasyClubRouter = express.Router();

/**
 * @swagger
 * /api/fantasy-club:
 * post:
 * summary: Create a new fantasy club for the authenticated user
 * description: Allows a logged-in user to create their first fantasy club.
 * tags:
 * - Fantasy Clubs
 * security:
 * - BearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - name
 * properties:
 * name:
 * type: string
 * description: The desired name for the fantasy club.
 * responses:
 * 201:
 * description: Fantasy club created successfully.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Fantasy club created successfully!
 * club:
 * $ref: '#/components/schemas/FantasyClub' # Reference to your FantasyClub schema in Swagger
 * 400:
 * description: Invalid input or user already has a club.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: User already has a fantasy club.
 * 401:
 * description: Unauthorized - No token or invalid token.
 * 500:
 * description: Server error.
 */
fantasyClubRouter.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, roster } = req.body;
    const userId = req.user.id; // Get user ID from authenticated request

    // Check if user already owns a club (unique: true on owner in schema helps, but explicit check is good)
    const existingClub = await FantasyClub.findOne({ owner: userId });
    if (existingClub) {
      logger.warn(`User ${userId} attempted to create a second club.`);
      return res.status(400).json({ message: 'User already has a fantasy club.' });
    }

    // Create the new fantasy club
    const newClub = new FantasyClub({
      name,
      owner: userId,
      roster,
      fantasyPoints: 0, // Initialize with 0 points
    });

    await newClub.save();

    logger.info(`Fantasy club "${name}" created for user ${userId}.`);
    res.status(201).json({ message: 'Fantasy club created successfully!', club: newClub });

  } catch (error) {
    if (error.code === 11000) { // Duplicate key error (e.g., club name already exists)
      logger.warn(`Attempt to create club with duplicate name: ${req.body.name}`);
      return res.status(400).json({ message: 'A club with this name already exists. Please choose a different name.' });
    }
    logger.error(`Error creating fantasy club for user ${req.user ? req.user.id : 'unknown'}: ${error.message}`);
    res.status(500).json({ message: 'Server error when creating fantasy club.' });
  }
});

export default fantasyClubRouter;