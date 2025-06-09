// This file is the main entry point for the application.
// It is executed directly via 'node server.js' or through npm scripts.

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDB from './schema/index.js';
import userRouter from './routes/userRouter.js';
import fantasyClubRouter from './routes/fantasyClubRouter.js';
import playerRouter from './routes/playerRouter.js';

import logger from './utils/logger.js';

import { PORT, FRONTEND_URL } from './config.js';

const app = express();

connectDB();

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use('/api/user', userRouter);
app.use('/api/fantasy-club', fantasyClubRouter);
app.use('/api/players', playerRouter);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err}`);
  res.status(500).send('Internal Server Error');
});
