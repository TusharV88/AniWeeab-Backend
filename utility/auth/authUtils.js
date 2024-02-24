import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Check Email
export function isEmailValid(email) {
    const email_pattern = "^[a-zA-Z0-9._%+-]+@gmail\.com$";

    return email.match(email_pattern);
}

// Encrpty User Password
export async function encrpytPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
}

// Verify User Password
export async function verifyPassword(password, hashPassword) {
    return await bcrypt.compare(password, hashPassword);
}

// Convert Token To Base64 String
function tokenToBase64(token) {
    return Buffer.from(token).toString('base64');
}

// Generate Token
export function tokenGenerator(user_id, secret, date) {
    const token = jwt.sign({ userID: user_id }, secret, { expiresIn: date });

    return tokenToBase64(token);
}

// Generate Reset Password Link
export function resetLinkGenerate(user_id) {
    const secret = user_id + process.env.JWT_SECRET;
    const token = tokenGenerator(user_id, secret, '15m');
    const id = tokenToBase64(user_id);

    return `http://localhost:5173/reset/${id}/${token}`;
}

// Convert Base64 String To Token
export function base64ToToken(token) {
    return Buffer.from(token, 'base64').toString();
}

// Verify Token
export function verifyToken(tokenBase, secret) {
    const token = base64ToToken(tokenBase);
    const result = jwt.verify(token, secret);

    return result;
}
