import express from "express";
import authRoute from "./src/routes/auth.js";
import threadRoute from "./src/routes/threadRoute.js";
import spotifyRoute from "./src/routes/spotifyRoute.js";
import cors from 'cors'
import dotenv from "dotenv";
import { globalLimiter, authLimiter } from "./src/middleware/rateLimiter.js";
dotenv.config();

const port = 3000;
const app = express();

// Apply global rate limiting to all routes
app.use(globalLimiter);

app.use(
  cors({
    origin: process.env.BASE_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authLimiter, authRoute);
app.use("/thread", threadRoute);
app.use("/track", spotifyRoute);

//app.post("/test", (req, res) => {
//  console.log("Test route body:", req.body);
//  res.json({ received: req.body });
//});

app.listen(port, () => {
  console.log("Server running on port", port);
});
