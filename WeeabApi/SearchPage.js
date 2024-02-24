import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.BASE_URL;

export const searchMedia = async (req, res) => {
    const { query, category } = req.params;
    const { pageNo } = req.query;

    if (req.user._id && query && category && pageNo) {
        try {
            let searchData;
            let isAnime = false;

            if (['tv', 'movie', 'ova', 'ona', 'special', 'music', 'cm', 'pv', 'tv_special'].includes(category.toLowerCase())) {
                isAnime = true;
            }

            if (isAnime) {
                searchData = await axios.get(url + '/anime', {
                    params: {
                        sfw: true,
                        type: category,
                        q: query,
                        unapproved: true,
                        page: pageNo,
                    },
                });
            } else {
                searchData = await axios.get(url + '/manga', {
                    params: {
                        sfw: true,
                        type: category,
                        q: query,
                        unapproved: true,
                        page: pageNo,
                    },
                });
            }

            res.status(200).json({
                data: searchData.data.data,
                pagination: searchData.data.pagination,
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
