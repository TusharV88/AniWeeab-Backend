import express from 'express';
import { userAuth } from '../middlewares/auth-middleware.js';
import { favoriteAdd, favoriteByUser, favoriteDelete } from '../controllers/favouriteController.js';

const router = express.Router();

router.post('/add', userAuth, favoriteAdd);
router.delete('/delete/:id', userAuth, favoriteDelete);
router.get('/user', userAuth, favoriteByUser);


export default router;