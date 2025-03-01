import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import connectDB from './database/connection.js';
import userRouter from './routes/fantasy/userRouter.js';
import { PORT } from './config.js';
import clearDatabase from './database/clearDatabase.js';

const app = express();

connectDB();
// clearDatabase(); // Uncomment to clear database during testing

app.use(cors());
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
