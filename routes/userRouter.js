/**
 * @file Express router for user authentication (registration and login).
 * This module handles API endpoints related to user management, including
 * creating new users, hashing passwords, and issuing JWTs for authentication.
 */
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User, FantasyClub } from '../schema/index.js';
import { JWT_SECRET } from '../config.js'; // Ensure this contains your secret key
import authMiddleware from '../middleware/authMiddleware.js'; // This is your authentication middleware
import logger from '../utils/logger.js'; // Ensure your logger is properly configured for backend

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
 * description: User created and JWT set in HTTP-only cookie.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: User created and logged in
 * 400:
 * description: User already exists or validation error.
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
      logger.warn(`Registration attempt for existing user: ${email || username}`);
      return res.status(400).json('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      username,
    });

    await user.save();
    logger.info(`New user registered: ${user.username} (${user.email})`);

    const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET, { expiresIn: '1h' }); // JWT payload expires in 1 hour

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 3600000, // Cookie expires in 1 hour (1000ms * 60s * 60min = 3,600,000ms)
    });

    res.status(201).json({ message: 'User created and logged in' }); // No longer sending token in body
  } catch (error) {
    if (error.name === 'ValidationError') {
      logger.error('Mongoose Validation Error during registration:', error.errors);
      res.status(400).json({ message: 'Validation Error', errors: error.errors });
    } else {
      logger.error('Error during registration:', error);
      res.status(500).json({ message: 'Server error during registration.' });
    }
  }
});

/**
 * @swagger
 * /api/users/login:
 * post:
 * summary: Log in a user
 * description: Authenticates a user with email/username and password, setting a JWT in an HTTP-only cookie upon successful login.
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
 * description: User successfully logged in and JWT set in HTTP-only cookie.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: User successfully logged in
 * 401:
 * description: User not found or invalid password.
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
      logger.warn(`Login attempt for non-existent user: ${email || username}`);
      return res.status(401).json('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      logger.warn(`Login attempt with invalid password for user: ${user.username}`);
      return res.status(401).json('Invalid password');
    }

    const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET, { expiresIn: '1h' });

    // Set the JWT as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 3600000, // 1 hour
    });

    logger.info(`User logged in: ${user.username}`);
    res.status(200).json({ message: 'User successfully logged in' }); // No longer sending token in body
  } catch (error) {
    logger.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});


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
    // Ensure req.user and req.user.id are populated by authMiddleware
    if (!req.user || !req.user.id) {
      logger.error('Authentication middleware did not provide user ID for /has-club endpoint. Token might be invalid or missing.');
      // It's better to respond with a 401 if authentication failed
      return res.status(401).json({ message: 'Unauthorized: User ID missing.' });
    }

    const userId = req.user.id;
    logger.info(`Checking if user ${userId} has a fantasy club`);

    // Use await for Mongoose query
    const club = await FantasyClub.findOne({ owner: userId });

    if (club) {
      logger.info(`User ${userId} has a club named ${club.name}`);
      return res.json({ hasClub: true, clubId: club._id, clubName: club.name });
    } else {
      logger.info(`User ${userId} does not have a fantasy club`);
      return res.json({ hasClub: false });
    }
  } catch (error) {
    logger.error(`Error checking club status for user ${req.user ? req.user.id : 'unknown'}: ${error.message}`);
    res.status(500).json({ message: 'Server error when checking club status.' });
  }
});

/**
 * @swagger
 * /api/users/auth/status:
 * get:
 * summary: Get authentication status and user/club details
 * description: Checks if the user is authenticated via JWT cookie and returns user details, including fantasy club status.
 * tags:
 * - Users
 * security:
 * - CookieAuth: [] # Indicates that authentication is via cookie
 * responses:
 * 200:
 * description: User authentication status and details.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * isAuthenticated:
 * type: boolean
 * description: True if the user is authenticated, false otherwise.
 * user:
 * type: object
 * properties:
 * id: { type: string }
 * username: { type: string }
 * email: { type: string }
 * hasClub: { type: boolean }
 * clubId: { type: string }
 * clubName: { type: string }
 * 401:
 * description: Not authenticated (shouldn't happen if authMiddleware handles it, but good for clarity).
 * 500:
 * description: Server error.
 */
userRouter.get('/auth/status', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      logger.error('Authentication middleware did not provide user ID for /auth/status endpoint. Token might be invalid or missing.');
      return res.status(401).json({
        isAuthenticated: false,
        message: 'User data not found.',
      });
    }

    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      logger.warn(`User with ID ${userId} not found during auth status check.`);
      res.clearCookie('token', { path: '/' }); // Clear cookie if user not found
      return res.status(401).json({
        isAuthenticated: false,
        message: 'User not found.',
      });
    }

    const club = await FantasyClub.findOne({ owner: userId });
    const hasClub = !!club;
    const clubId = club ? club._id : null;
    const clubName = club ? club.name : null;

    logger.info(`User ${user.username} (${user.email}) authentication status checked. Has club: ${hasClub}`);

    res.status(200).json({
      isAuthenticated: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      hasClub,
      clubId,
      clubName,
    });
  } catch (error) {
    logger.error(`Error checking authentication status for user ${req.user ? req.user.id : 'unknown'}: ${error.message}`);
    res.status(500).json({ message: 'Server error when checking authentication status.' });
  }
});

/**
 * @swagger
 * /api/users/logout:
 * post:
 * summary: Log out a user
 * description: Clears the authentication JWT cookie, effectively logging out the user.
 * tags:
 * - Users
 * responses:
 * 200:
 * description: User successfully logged out.
 */
userRouter.post('/logout', (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
    });
    logger.info('User logged out (cookie cleared).');
    res.status(200).json({ message: 'Logged out successfully.' });
});

export default userRouter;