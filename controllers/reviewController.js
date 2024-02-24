import reviewModel from "../models/Review.model.js";


// -------------------- Controllers ------------------------- \\

export const reviewAdd = async (req, res) => {
    const { content, mediaID, mediaType, mediaImage, mediaTitle, mediaTitleEnglish } = req.body;

    if (req.user && content && mediaID && mediaType && mediaImage && mediaTitle && mediaTitleEnglish) {
        try {
            const userReview = await reviewModel.create({
                user: req.user._id,
                username: req.user.name,
                content,
                mediaID,
                mediaType,
                mediaImage,
                mediaTitle,
                mediaTitleEnglish
            });

            await userReview.save();

            res.status(201).json({
                msg: "Your review has been added successfully!!"
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


export const reviewDelete = async (req, res) => {
    const { id } = req.params;

    if (id) {
        try {
            const userReview = await reviewModel.findByIdAndDelete(id);

            if (userReview) {
                res.status(200).json({
                    msg: 'Your review has been deleted successfully!!'
                });
            } else {
                res.status(400).json({
                    statusCode: 400,
                    msg: "Oops! It seems like the review with the provided ID doesn't exist or has been removed."
                });
            }
        } catch (error) {
            res.status(400).json({
                statusCode: 400,
                msg: error.message
            });
        }
    } else {
        res.status(400).json({
            statusCode: 400,
            msg: 'The provided ID is empty. Please make sure to enter a valid ID before proceeding.'
        });
    }
}


export const reviewByUser = async (req, res) => {
    if (req.user._id) {
        try {
            const userReviews = await reviewModel.find({ user: req.user._id });

            res.status(200).json({
                msg: "Reviews By User have been fetched successfully.",
                userReviews
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


export const reviewByMedia = async (req, res) => {
    const { mediaID } = req.query;

    if (mediaID) {
        try {
            const mediaReviews = await reviewModel.find({ mediaID: mediaID });

            res.status(200).json({
                msg: 'Reviews By Media have been fetched successfully.',
                mediaReviews
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
            msg: 'Media ID cannot be empty. Please specify a valid media ID.'
        });
    }
}
