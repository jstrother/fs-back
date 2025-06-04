/**
 * @file Authentication middleware for verifying JSON Web Tokens (JWTs).
 * This middleware extracts a token from the request header, verifies it,
 * and attaches the decoded user information to the request object (`req.user`).
 * It prevents unauthenticated access to protected routes.
 */
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import logger from '../utils/logger.js';

/**
 * Express middleware to authenticate requests using JWTs.
 * It checks for a token in the 'Authorization' header, verifies it,
 * and sets `req.user` with the decoded user payload.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {void}
 */
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    logger.warn('Authentication attempt without token: Authorization denied');
    return res.status(401).json({
      message: 'No token, authorization denied',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    logger.error(`Auth middleware error: Token is not valid - ${error.message}`);
    res.clearCookie('token');
    return res.status(401).json({
      message: 'Token is not valid',
    });
  }
}

export default authMiddleware;