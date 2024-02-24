import mongoose, { Schema } from "mongoose";


const favoriteSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    mediaID: {
        type: String,
        required: true,
    },
    mediaType: {
        type: String,
        required: true,
    },
    mediaImage: {
        type: String,
        required: true
    },
    mediaTitle: {
        type: String,
        required: true
    },
    mediaTitleEnglish: {
        type: String,
        required: true
    },
});


const favoriteModel = mongoose.model("favourites", favoriteSchema);

export default favoriteModel;
