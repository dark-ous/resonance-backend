import express from 'express'
const router = express.Router();
import { getSpotifySongsBySearch } from '../../services/spotifyServices.js';


router.get('/search/:query',getSpotifySongsBySearch)

export default router;