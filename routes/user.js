import express from "express";
import { userAuth } from "../middlewares/auth-middleware.js";
import { deleteUserAccount, resetUserPassword, sendResetPasswordLink, updateUserPassword, userLogged, userLogin, userRegistration } from "../controllers/userController.js";

const router = express.Router();

// Public Route
router.post('/register', userRegistration);
router.post('/login', userLogin);
router.post('/sendResetLink', sendResetPasswordLink);
router.post('/reset/:id/:token', resetUserPassword);


// Private Route
router.put('/updatePassword', userAuth, updateUserPassword);
router.get('/logged', userAuth, userLogged);
router.delete('/delete-account', userAuth, deleteUserAccount);


export default router;