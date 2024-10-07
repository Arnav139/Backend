import rateLimit from "express-rate-limit";

// Global rate limiter
export const globalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 200, // Limit each IP to 200 requests per window
    message: "Too many requests from this IP, please try again after 5 minutes.",
});

// Rate limiter for login
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per window
    message: "Too many login attempts. Please try again after 15 minutes.",
});

export const publicApiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // Allow 100 requests per 5 minutes for public APIs
    message: "Rate limit exceeded. Please try again after 5 minutes.",
});
