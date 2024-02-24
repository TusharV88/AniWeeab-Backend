import express from 'express';
import { userAuth } from '../middlewares/auth-middleware.js';
import { reviewAdd, reviewByMedia, reviewByUser, reviewDelete } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/user', userAuth, reviewByUser);
router.get('/media', userAuth, reviewByMedia);
router.post('/add', userAuth, reviewAdd);
router.delete('/delete/:id', userAuth, reviewDelete);


export default router;