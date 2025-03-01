import mongoose from "mongoose";

async function clearDatabase() {
  try {
    await mongoose.connection.dropDatabase();
    console.log("Database cleared");
  } catch (error) {
    console.error("Error clearing database");
    console.error(error);
  }
}

export default clearDatabase;