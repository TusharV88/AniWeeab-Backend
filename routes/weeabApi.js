import express from 'express';
import { userAuth } from '../middlewares/auth-middleware.js';
import { seasonsNow, mediaTop } from '../WeeabApi/HomePage.js';
import { animeData, animeSeasons } from '../WeeabApi/AnimePage.js';
import { mangaData, mangaSeasons } from '../WeeabApi/MangaPage.js';
import { searchMedia } from '../WeeabApi/SearchPage.js';
import { getDetailsById } from '../WeeabApi/DetailPage.js';

const router = express.Router();

// Home Page
router.get('/seasons', userAuth, seasonsNow);
router.get('/popular', userAuth, mediaTop);
router.get('/favorite', userAuth, mediaTop);

// Anime Page
router.get('/anime/seasons', userAuth, animeSeasons);
router.get('/anime/:category', userAuth, animeData);

// Manga Page
router.get('/manga/seasons', userAuth, mangaSeasons);
router.get('/manga/:category', userAuth, mangaData);

// Search Page
router.get('/search/:category/:query', userAuth, searchMedia);

// Detail Page
router.get('/detail/:category/:id', userAuth, getDetailsById);


export default router;