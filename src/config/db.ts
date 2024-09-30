import mongoose from 'mongoose';
import envConf from './envConf'; // Assuming you have your configuration object

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(envConf.mongoDbConnectionString);
    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
