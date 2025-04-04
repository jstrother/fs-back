import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import connectDB from './database/connection.js';
import createLoopedTimer from './helpers/createLoopedTimer.js';
import getPlayerStats from './statistics/getPlayerStats.js';
import userRouter from './routes/fantasy/userRouter.js';
import { PORT, FRONTEND_URL } from './config.js';

const app = express();

connectDB();
// getPlayerStats();

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
  console.log(`Server running on port ${PORT}`);
});
