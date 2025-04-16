import mongoose from 'mongoose';
import enhancePlayerStatsWithTypeInfo from '../statistics/players/enhancePlayerStatsWithTypeInfo.js';
import Type from '../schema/api/typeSchema.js';

jest.mock('../utils/logger.js')