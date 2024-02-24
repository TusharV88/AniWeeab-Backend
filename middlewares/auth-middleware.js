import userModel from "../models/User.model.js";
import { verifyToken } from "../utility/auth/authUtils.js";
import dotenv from 'dotenv';

dotenv.config();

export const userAuth = async (req, res, next) => {
    let token;

    const { authorization } = req.headers;

    if (authorization && authorization.startsWith('Bearer')) {
        try {
            // Get token from authorization 
            token = authorization.split(' ')[1];

            // Verify Token
            const { userID } = await verifyToken(token, process.env.JWT_SECRET);

            // Get user data from token
            req.user = await userModel.findById(userID);

            if (req.user) {
                next();
            } else {
                res.status(404).send({
                    statusCode: 404,
                    msg: 'Please, log-in with new credentials or create a new account'
                });
            }
        } catch (error) {
            res.status(400).send({
                statusCode: 400,
                msg: error.message
            });
        }
    } else {
        res.status(404).send({
            statusCode: 404,
            msg: "No token found in the request header. You are not logged in."
        });
    }
}
