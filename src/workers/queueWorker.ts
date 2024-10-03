import { Job } from "bull";
import apiQueue from "../queues/apiQueue";
import { Request, Response } from "express";

// Define the shape of the job data
interface JobData {
    req: Request;
    res: Response;
    handler: (req: Request, res: Response) => Promise<void>;
}

// Worker to process jobs from the queue
apiQueue.process(async (job: Job<JobData>) => {
    const { req, res, handler } = job.data;

    try {
        // Process the request with the handler
        await handler(req, res);
    } catch (error) {
        console.error("Error processing job: ", error);
    }
});

export default apiQueue;
