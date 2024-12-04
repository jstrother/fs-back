import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRoute.js';

const app = express();
const jsonParser = bodyParser.json();

app.use(jsonParser);
app.use('/user', userRouter);
