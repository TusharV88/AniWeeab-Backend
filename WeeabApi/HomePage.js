import axios from 'axios';
import { dataShuffler, sortByScore } from '../utility/tools/dataUtil.js';
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.BASE_URL;


export const seasonsNow = async (req, res) => {
    if (req.user._id) {
        try {
            const animeData = await axios.get(url + '/seasons/now', {
                params: {
                    limit: 5,
                    sfw: true,
                    type: 'tv',
                    unapproved: true
                },
            });

            const mangaData = await axios.get(url + '/top/manga', {
                params: {
                    limit: 5,
                    filter: "publishing",
                },
            });

            const data = dataShuffler([], mangaData.data.data);

            res.status(200).json({
                data
            });
        } catch (error) {
            res.status(error.response.status).json({
                statusCode: error.response.status,
                msg: error.message
            });
        }
    } else {
        res.status(400).json({
            statusCode: 400,
            msg: 'You are not logged in!!'
        });
    }
}



export const mediaTop = async (req, res) => {
    const pathname = req.url;
    const category = pathname === '/popular' ? 'bypopularity' : 'favorite';

    if (req.user._id) {
        try {
            const num = Math.floor(Math.random() * 50) + 1;
            const pageNo = category === 'bypopularity' ? 1 : num;

            const animeData = await axios.get(url + '/top/anime', {
                params: {
                    limit: 20,
                    sfw: true,
                    filter: category,
                    type: 'tv',
                    page: pageNo
                },
            });

            const mangaData = await axios.get(url + '/top/manga', {
                params: {
                    limit: 20,
                    filter: category,
                    // type: 'manga',
                    page: pageNo
                },
            });

            const topAnime = sortByScore(animeData.data.data, 'score');
            const topManga = sortByScore(mangaData.data.data, 'score');

            res.status(200).json({
                topAnime,
                topManga
            });

        } catch (error) {
            res.status(error.response.status).json({
                statusCode: error.response.status,
                msg: error.message
            });
        }
    } else {
        res.status(400).json({
            statusCode: 400,
            msg: "Oops! It seems like there's a missing piece. To proceed, please make sure you're logged in or include the necessary information in your request."
        });
    }
}
