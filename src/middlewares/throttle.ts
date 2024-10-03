import { Request, Response, NextFunction } from "express";
import apiQueue from "../queues/apiQueue";
import redisClient from "../config/redis";

// Extend Express Request to include the handler property
interface CustomRequest extends Request {
    handler: (req: Request, res: Response) => Promise<void>;
}

const MAX_CONCURRENT_REQUESTS = 10;

export const throttleRequests = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const currentRequestCount = parseInt(
            (await redisClient.get("globalRequestCount")) || "0",
            10
        );

        if (currentRequestCount < MAX_CONCURRENT_REQUESTS) {
            await redisClient.incr("globalRequestCount"); // Increment global request count
            console.log("processing request immediately");
            next(); // Process the request immediately

            res.on("finish", () => {
                redisClient.decr("globalRequestCount"); // Decrement after request is done
            });
        } else {
            console.log("Adding it to queue");
            // Queue the request if max concurrent requests are reached
            await apiQueue.add({ req, res, handler: req.handler });
            res.status(202).json({ message: "Request is queued and will be processed shortly." });
        }
    } catch (err) {
        console.error("Error in throttling middleware:", err);
        res.status(500).json({ message: "Server error" });
    }
};
