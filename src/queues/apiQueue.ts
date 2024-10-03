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

// Process 10 jobs at a time
apiQueue.process(10, async (job: Job<JobData>) => {
    const { req, res, handler } = job.data;

    try {
        await handler(req, res); // Call the actual API handler
    } catch (error) {
        console.error("Error processing job: ", error);
    }
});

export default apiQueue;
