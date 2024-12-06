import express from 'express';
import bodyParser from 'body-parser';
// import cors from 'cors';
import connectDB from './database/connection.js';
import userRouter from './routes/fantasy/userRouter.js';

import { PORT } from './config.js';

const app = express();
const jsonParser = bodyParser.json();

connectDB();

app.use(jsonParser);
// app.use(cors);
app.use('/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
