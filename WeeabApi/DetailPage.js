import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.BASE_URL;

export const getDetailsById = async (req, res) => {
    const { category, id } = req.params;

    if (req.user._id && category && id) {
        try {
            let detailData;
            let charactersData;
            let recommendationData;
            let recommendLimited = [];

            if (category === 'anime') {
                detailData = await axios.get(url + `/anime/${id}/full`);

                await new Promise(resolve => setTimeout(resolve, 2000));

                charactersData = await axios.get(url + `/anime/${id}/characters`);

                await new Promise(resolve => setTimeout(resolve, 2000));

                recommendationData = await axios.get(url + `/anime/${id}/recommendations`);
            } else {
                detailData = await axios.get(url + `/manga/${id}/full`);

                await new Promise(resolve => setTimeout(resolve, 2000));

                charactersData = await axios.get(url + `/manga/${id}/characters`);

                await new Promise(resolve => setTimeout(resolve, 2000));

                recommendationData = await axios.get(url + `/manga/${id}/recommendations`);
            }

            const recommendationsLength = recommendationData.data.data.length;
            if (recommendationsLength > 20) {
                for (let index = 0; index < 20; index++) {
                    recommendLimited.push(recommendationData.data.data[index]);
                }
            }

            res.status(200).json({
                detailData: detailData.data.data,
                charactersData: charactersData.data.data,
                recommendationData: recommendationsLength > 20 ? recommendLimited : recommendationData.data.data
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
