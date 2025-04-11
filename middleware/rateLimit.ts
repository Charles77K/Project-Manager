// middleware/rateLimiter.ts
import rateLimit from "express-rate-limit";

export const contactFormLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 2, // max 3 requests per IP in 5 mins
  message: "Too many requests. Please try again later.",
});
