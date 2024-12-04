import express from 'express';
import axios from 'axios';
import { API_BASE_URL, API_TOKEN } from '../../config.js';

const leaguesRouter = express.Router();

leaguesRouter.get('/leagues-data', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leagues?api_token=${API_TOKEN}`);
    res.send(response.data);
  } catch (error) {
    res.status(400);
    console.log('Uh-oh! Something went wrong! Unable to fetch data');
  }
});

export default leaguesRouter;