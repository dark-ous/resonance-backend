import express from "express";
import { createLimiter } from "../src/middleware/rateLimiter.js";
import axios from "axios";

const app = express();
const port = 4001;

const limiter = createLimiter({
  windowMs: 5000, // 5 seconds window
  limit: 3, // 3 requests maximum
  message: { error: "Limit exceeded" },
});

app.use(limiter);
app.get("/test", (req, res) => {
  res.json({ success: true });
});

const server = app.listen(port, async () => {
  console.log(`Test server running on port ${port}`);

  try {
    for (let i = 1; i <= 5; i++) {
      try {
        const response = await axios.get(`http://localhost:${port}/test`);
        console.log(
          `Request ${i}: Success. Headers: Limit=${response.headers["ratelimit-limit"]}, Remaining=${response.headers["ratelimit-remaining"]}, Reset=${response.headers["ratelimit-reset"]}`
        );
      } catch (err) {
        if (err.response && err.response.status === 429) {
          console.log(`Request ${i}: Rate limited (429). Response:`, err.response.data);
        } else {
          console.error(`Request ${i}: Error:`, err.message);
        }
      }
    }
  } finally {
    server.close(() => {
      console.log("Test server stopped.");
      process.exit(0);
    });
  }
});
