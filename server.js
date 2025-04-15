import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { connectDB } from './schema/index.js';
import getStats from './statistics/getStats.js';
import userRouter from './routes/userRouter.js';
import logger from './utils/logger.js';

import { PORT, FRONTEND_URL } from './config.js';

const app = express();

connectDB();
getStats();

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.send('Fantasy Soccer for All!');
});

app.get('/user', (req, res) => {
  res.send('User Route');
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err}`);
  res.status(500).send('Internal Server Error');
});
