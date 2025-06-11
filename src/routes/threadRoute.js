import express from 'express';
const router = express.Router();

import { isAuth } from "../middleware/isAuth.js";
import { createThread, showThreads, getReplies } from '../controller/threadController.js';

// 🔹 Post a top-level thread (parentId = null)
router.post('/post', isAuth, createThread);

// 🔹 Get all threads for a specific song
router.get('/get/:songID', showThreads);

// 🔹 Get replies for a specific thread
router.get('/replies/:threadID',  getReplies);

// 🔹 Post a reply to a specific thread
router.post('/:threadID/reply', isAuth, createThread); 

export default router;
