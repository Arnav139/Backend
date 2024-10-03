import Redis, { Redis as RedisClient } from "ioredis";

// Create a Redis client with type annotations
const redisClient: RedisClient = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
});

// Error handling
redisClient.on("error", (err: Error) => {
    console.error("Redis error: ", err);
});

export default redisClient;
