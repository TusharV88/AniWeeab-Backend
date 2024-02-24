import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Mail Transporter
export const transporter = createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.APP_ID,
        pass: process.env.APP_SECRET,
    },
});