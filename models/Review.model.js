import mongoose, { Schema } from "mongoose";


const reviewSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    content: {
        type: String,
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
    createdAt: {
        type: String,
        default: () => {
            const currentDate = new Date();
            const day = String(currentDate.getDate()).padStart(2, '0');
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const year = currentDate.getFullYear();
            const hours = String(currentDate.getHours()).padStart(2, '0');
            const minutes = String(currentDate.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'pm' : 'am';

            return `${day}/${month}/${year} - ${hours % 12 || 12}:${minutes} ${ampm}`;
        },
    }
});


const reviewModel = mongoose.model("reviews", reviewSchema);

export default reviewModel;
