import favoriteModel from "../models/Favourite.model.js";


// -------------------- Controllers ------------------------- \\

export const favoriteAdd = async (req, res) => {
    const { mediaID, mediaType, mediaImage, mediaTitle, mediaTitleEnglish } = req.body;

    if (mediaID && mediaType && mediaImage && mediaTitle && mediaTitleEnglish) {
        try {
            const userFavourite = await favoriteModel.create({
                user: req.user._id,
                mediaID,
                mediaType,
                mediaImage,
                mediaTitle,
                mediaTitleEnglish
            });

            res.status(201).json({
                msg: 'Added To Favorites:',
                title: mediaTitle
            });
        } catch (error) {
            res.status(400).json({
                statusCode: 400,
                msg: error.message
            });
        }
    } else {
        res.status(400).json({
            statusCode: 400,
            msg: 'Oops! One or more fields are empty.'
        });
    }
}


export const favoriteDelete = async (req, res) => {
    const { id } = req.params;

    if (id) {
        try {
            const userFavourite = await favoriteModel.findByIdAndDelete({ _id: id });

            res.status(200).json({
                msg: 'Removed From Favorites:',
                title: userFavourite.mediaTitle
            });
        } catch (error) {
            res.status(400).json({
                statusCode: 400,
                msg: error.message
            });
        }
    } else {
        res.status(400).json({
            statusCode: 400,
            msg: 'Oops! One or more fields are empty.'
        });
    }
}


export const favoriteByUser = async (req, res) => {
    if (req.user._id) {
        try {
            const userFavorites = await favoriteModel.find({ user: req.user._id });

            res.status(200).json({
                msg: `Favourites By User have been fetched successfully.`,
                userFavorites
            });
        } catch (error) {
            res.status(400).json({
                statusCode: 400,
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
