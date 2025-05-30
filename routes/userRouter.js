/**
 * @file Express router for user authentication (registration and login).
 * This module handles API endpoints related to user management, including
 * creating new users, hashing passwords, and issuing JWTs for authentication.
 */
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User, FantasyClub } from '../schema/index.js';
import { JWT_SECRET } from '../config.js';
import authMiddleware from '../middleware/authMiddleware.js';
import logger from '../utils/logger.js';

const userRouter = express.Router();

/**
 * @swagger
 * /api/users/register:
 * post:
 * summary: Register a new user
 * description: Creates a new user account with email, username, and password.
 * tags:
 * - Users
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * - username
 * properties:
 * email:
 * type: string
 * format: email
 * description: The user's email address.
 * password:
 * type: string
 * format: password
 * description: The user's chosen password.
 * username:
 * type: string
 * description: The user's chosen unique username.
 * responses:
 * 201:
 * description: User created and successfully logged in. Returns a JWT.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: User created and logged in
 * token:
 * type: string
 * description: JSON Web Token for authentication.
 * 400:
 * description: User already exists or validation error.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: User already exists
 * errors:
 * type: object
 * description: Details about validation errors (if applicable).
 * 500:
 * description: Server error during registration.
 */
userRouter.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).json('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      username,
    });

    await user.save();

    const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User created and logged in', token });
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      logger.error('Mongoose Validation Error:', error.errors);
      res.status(400).json({ message: 'Validation Error', errors: error.errors });
    } else {
      // Other errors
      logger.error('Error during registration:', error);
      res.status(500).json(error);
    }
    logger.log('Uh-oh! Something went wrong! Unable to register');
  }
});

/**
 * @swagger
 * /api/users/login:
 * post:
 * summary: Log in a user
 * description: Authenticates a user with email/username and password, returning a JWT upon successful login.
 * tags:
 * - Users
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - password
 * properties:
 * email:
 * type: string
 * format: email
 * description: The user's email address (either email or username is required).
 * username:
 * type: string
 * description: The user's username (either email or username is required).
 * password:
 * type: string
 * format: password
 * description: The user's password.
 * responses:
 * 200:
 * description: User successfully logged in. Returns a JWT.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * token:
 * type: string
 * description: JSON Web Token for authentication.
 * 401:
 * description: User not found or invalid password.
 * content:
 * application/json:
 * schema:
 * type: string
 * example: User not found
 * 500:
 * description: Server error during login.
 */
userRouter.post('/login', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res.status(401).json('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json('Invalid password');
    }

    const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
    logger.log('logged in');
  } catch (error) {
    res.status(500).json(error);
    logger.log('Uh-oh! Something went wrong! Unable to login');
  }

  /**
   * @swagger
   * /api/users/has-club:
   * get:
   * summary: Check if the authenticated user has a fantasy club
   * description: Returns true if the logged-in user owns a fantasy club, false otherwise.
   * tags:
   * - Users
   * security:
   * - BearerAuth: []
   * responses:
   * 200:
   * description: Status of the user's fantasy club.
   * content:
   * application/json:
   * schema:
   * type: object
   * properties:
   * hasClub:
   * type: boolean
   * description: True if the user has a club, false otherwise.
   * clubId:
   * type: string
   * description: The ID of the fantasy club if it exists.
   * clubName:
   * type: string
   * description: The name of the fantasy club if it exists.
   * 401:
   * description: Unauthorized - No token or invalid token.
   * 500:
   * description: Server error.
   */
  userRouter.get('/has-club', authMiddleware, async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        logger.error('Authentication middleware did not provide user ID for /has-club endpoint');
        return res.status(500).json({
          message: 'User not authenticated or ID missing',
        });
      }

      const userId = req.user.id;
      logger.info(`Checking if user ${userId} has a fantasy club`);

      const club = FantasyClub.findOne({ owner: userId});

      if (club) {
        logger.info(`User ${userId} has a club named ${club.name}`);
        return res.json({ hasClub: true, clubId: club._id, clubName: club.name });
      } else {
        logger.info(`User ${userId} does not have a fantasy club`);
        return res.json({ hasClub: false });
      }
    } catch (error) {
      logger.error(`Error checking club status for user ${req.user ? req.user.id : 'unknown'}: ${error.message}`);
      res.status(500).json({
        message: 'Server error when checking club status',
      });
    }
  });
});

export default userRouter;