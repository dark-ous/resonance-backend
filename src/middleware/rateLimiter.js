/**
 * Helper to create an in-memory rate limiter middleware.
 * Implements draft-7 rate limiting headers:
 * - RateLimit-Limit: max requests allowed
 * - RateLimit-Remaining: remaining requests
 * - RateLimit-Reset: time left in seconds until reset
 */
export const createLimiter = (options) => {
  const { windowMs, limit, message } = options;
  const ipRequests = new Map();

  // Periodically clean up expired records to avoid memory leaks
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipRequests.entries()) {
      if (now > data.resetTime) {
        ipRequests.delete(ip);
      }
    }
  }, 10 * 60 * 1000); // Clean up every 10 minutes

  // Prevent this timer from keeping the Node.js process alive in test scripts
  if (interval.unref) {
    interval.unref();
  }

  return (req, res, next) => {
    // Identify client by IP (respecting proxy headers if set)
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const now = Date.now();

    let clientData = ipRequests.get(ip);

    // Reset rate limit if window has expired
    if (!clientData || now > clientData.resetTime) {
      clientData = {
        count: 0,
        resetTime: now + windowMs,
      };
      ipRequests.set(ip, clientData);
    }

    clientData.count++;

    const remaining = Math.max(0, limit - clientData.count);
    res.setHeader("RateLimit-Limit", limit);
    res.setHeader("RateLimit-Remaining", remaining);
    res.setHeader("RateLimit-Reset", Math.ceil((clientData.resetTime - now) / 1000));

    if (clientData.count > limit) {
      return res.status(429).json(
        message || {
          error: "Too many requests, please try again later.",
        }
      );
    }

    next();
  };
};

// Global rate limiter applied to all requests (e.g., 100 requests per 15 minutes)
export const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    error: "Too many requests, please try again later.",
  },
});

// Stricter rate limiter for authentication routes (e.g., 20 requests per 15 minutes)
export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: {
    error: "Too many login or registration attempts, please try again later.",
  },
});
