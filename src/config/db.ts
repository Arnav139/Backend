// import mongoose from 'mongoose';
// import envConf from './envConf';
// const connectDB = async (): Promise<void> => {
//   try {
//     await mongoose.connect(envConf.mongoDbConnectionString);
//     console.log('MongoDB Connected successfully');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     process.exit(1); // Exit the process with failure
//   }
// };

// export default connectDB;

// src/config/db.ts
import mongoose from "mongoose";
import envConf from "./envConf";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(envConf.mongoDbConnectionString);
    console.log("MongoDB Connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with failure
  }
};

// Function to disconnect from MongoDB
const disconnectDB = async (): Promise<void> => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
};

export { connectDB, disconnectDB };
