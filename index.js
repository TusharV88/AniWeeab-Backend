import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import userRoute from './routes/user.js';
import reviewRoute from './routes/review.js';
import favoriteRoute from './routes/favourite.js';
import weeabApiRoute from './routes/weeabApi.js';
import { connectDB } from "./database/connectDB.js";

dotenv.config(); 

// Important Variable
const app = express();
const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL;

// Database Connection
connectDB(DATABASE_URL);

// cors policy
app.use(cors());

// use format data
app.use(express.json());


// all routes
app.use('/api/user', userRoute);
app.use('/api/review', reviewRoute);
app.use('/api/favorite', favoriteRoute);
app.use('/api/weeabApi', weeabApiRoute);


// server listening...
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});
