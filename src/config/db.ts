import mongoose from 'mongoose';
import envConf from './envConf'; 
import logger from './logger';
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(envConf.mongoDbConnectionString);
    logger.info('MongoDB Connected successfully');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
