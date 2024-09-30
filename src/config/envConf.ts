// Define the type for the environment configuration
interface EnvConfig {
  mongoDbConnectionString: string;
  port: string;
  corsOrigin: string;
  accessTokenSecret: string;
  accessTokenExpiry: string;
  refreshTokenSecret: string;
  refreshTokenExpiry: string;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
}

// Safely handle undefined environment variables by providing fallback values
const envConf: EnvConfig = {
  mongoDbConnectionString: process.env.MONGODB_CONNECTION_STRING || '',
  port: process.env.PORT || '3000',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '', 
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '', 
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
}

export default envConf;
