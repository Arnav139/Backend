import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
    mongoDbConnectionString: string;
    port: string;
    corsOrigin: string;
    accessTokenSecret: string;
    accessTokenExpiry: string;
    refreshTokenSecret: string;
    refreshTokenExpiry: string;
}

const getEnvVar = (key: string, fallback?: string): string => {
    const value = process.env[key];
    if (!value && !fallback) {
        console.error(`Error: Missing environment variable: ${key}`);
        process.exit(1);
    }
    return value || fallback || "";
};

const envConf: EnvConfig = {
    mongoDbConnectionString: getEnvVar("MONGODB_CONNECTION_STRING"),
    port: getEnvVar("PORT", "3000"),
    corsOrigin: getEnvVar("CORS_ORIGIN", "*"),
    accessTokenSecret: getEnvVar("ACCESS_TOKEN_SECRET"),
    accessTokenExpiry: getEnvVar("ACCESS_TOKEN_EXPIRY", "7d"),
    refreshTokenSecret: getEnvVar("REFRESH_TOKEN_SECRET"),
    refreshTokenExpiry: getEnvVar("REFRESH_TOKEN_EXPIRY", "21d"),
};

export default envConf;
