import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const options = {
    dbName: process.env.DATABASE_NAME
};


export const connectDB = async (database_url) => {
    try {
        await mongoose.connect(database_url, options);
        console.log("Database is connected!!");
    } catch (error) {
        console.log(`Database Error: ${error.message}`)
    }
}
