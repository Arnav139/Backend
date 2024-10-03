import Bull, { Job } from "bull";
import { Request, Response } from "express";

// Define the shape of the job data
interface JobData {
    req: Request;
    res: Response;
    handler: (req: Request, res: Response) => Promise<void>;
}

// Create a Redis-backed queue
const apiQueue = new Bull<JobData>("api-requests", {
    redis: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
    },
});

// Export the queue
export default apiQueue;
