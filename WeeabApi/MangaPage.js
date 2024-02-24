import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.BASE_URL;

export const mangaSeasons = async (req, res) => {
    if (req.user._id) {
        try {
            const mangaData = await axios.get(url + '/top/manga', {
                params: {
                    limit: 10,
                    filter: "publishing",
                },
            });

            res.status(200).json({
                seasons: mangaData.data.data
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


export const mangaData = async (req, res) => {
    const { category } = req.params;
    const { pageNo } = req.query;

    if (req.user._id && category && pageNo) {
        try {
            let mangaData;

            if (category === 'Upcoming') {
                mangaData = await axios.get(url + '/top/manga', {
                    params: {
                        filter: "upcoming",
                        page: pageNo
                    },
                });
            } else if (category === 'Seasons Now') {
                mangaData = await axios.get(url + '/top/manga', {
                    params: {
                        unapproved: "publishing",
                        page: pageNo
                    },
                });
            } else if (category === 'Top Favorites') {
                mangaData = await axios.get(url + '/top/manga', {
                    params: {
                        filter: 'favorite',
                        page: pageNo
                    },
                });
            } else if (category === 'Most Popular') {
                mangaData = await axios.get(url + '/top/manga', {
                    params: {
                        filter: 'bypopularity',
                        page: pageNo
                    },
                });
            }

            res.status(200).json({
                data: mangaData.data.data,
                pagination: mangaData.data.pagination
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
