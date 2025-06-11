import express from 'express'
const router = express.Router();
import {isAuth} from  "../middleware/isAuth.js"
import { getSpotifySongsBySearch } from '../../services/spotifyServices.js';


router.get('/search/:query',getSpotifySongsBySearch)

export default router;