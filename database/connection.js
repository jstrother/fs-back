import mongoose from "mongoose";
import { DB_URL } from "../config.js";

async function connectDB() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database");
    console.error(error);
  }
}

export default connectDB;