import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  clubTeam: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  }
});