import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.BASE_URL;

export const animeSeasons = async (req, res) => {
    if (req.user._id) {
        try {
            const animeData = await axios.get(url + '/seasons/now', {
                params: {
                    limit: 10,
                    sfw: true,
                    type: 'tv',
                    unapproved: true
                },
            });

            res.status(200).json({
                seasons: animeData.data.data
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


export const animeData = async (req, res) => {
    const { category } = req.params;
    const { pageNo } = req.query;

    if (req.user._id && category && pageNo) {
        try {
            let animeData;

            if (category === 'Upcoming') {
                animeData = await axios.get(url + '/seasons/upcoming', {
                    params: {
                        sfw: true,
                        unapproved: true,
                        page: pageNo
                    },
                });
            } else if (category === 'Seasons Now') {
                animeData = await axios.get(url + '/seasons/now', {
                    params: {
                        sfw: true,
                        unapproved: true,
                        page: pageNo
                    },
                });
            } else if (category === 'Top Favorites') {
                animeData = await axios.get(url + '/top/anime', {
                    params: {
                        sfw: true,
                        filter: 'favorite',
                        unapproved: true,
                        page: pageNo
                    },
                });
            } else if (category === 'Most Popular') {
                animeData = await axios.get(url + '/top/anime', {
                    params: {
                        sfw: true,
                        filter: 'bypopularity',
                        unapproved: true,
                        page: pageNo
                    },
                });
            }

            res.status(200).json({
                data: animeData.data.data,
                pagination: animeData.data.pagination
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
