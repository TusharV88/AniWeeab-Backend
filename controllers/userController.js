import userModel from "../models/User.model.js";
import reviewModel from "../models/Review.model.js";
import favoriteModel from "../models/Favourite.model.js";
import { transporter } from "../utility/mailer/PasswordResetMail.js";
import { base64ToToken, encrpytPassword, isEmailValid, resetLinkGenerate, tokenGenerator, verifyPassword, verifyToken } from "../utility/auth/authUtils.js";
import dotenv from 'dotenv';

dotenv.config();


// -------------------- Controllers ------------------------- \\

export const userRegistration = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (name && email && password && confirmPassword) {
        const user = await userModel.findOne({ email: email });
        const name_len = name.length;
        const pass_len = password.length;

        if (user) {
            res.status(409).json({
                status: false,
                msg: 'This email address is already in use. Please choose another email address.'
            });
        } else {
            if (name_len < 5 || name_len > 15) {
                res.status(400).json({
                    status: false,
                    msg: 'Name must be between 5 and 15 characters.'
                });
            } else if (isEmailValid(email) === null) {
                res.status(400).json({
                    status: false,
                    msg: 'The email address you entered does not appear to be a valid Gmail address.'
                });
            } else if (password !== confirmPassword) {
                res.status(400).json({
                    status: false,
                    msg: 'Passwords do not match. Please make sure your passwords match.'
                });
            } else if (pass_len < 8 || pass_len > 25) {
                res.status(400).json({
                    status: false,
                    msg: 'Password must be between 8 and 25 characters.'
                });
            } else {
                try {
                    const hashPassword = await encrpytPassword(password);

                    const newUser = await userModel.create({
                        name,
                        email,
                        password: hashPassword
                    });

                    await newUser.save();
                    const token = tokenGenerator(newUser._id, process.env.JWT_SECRET, '30d');

                    res.status(201).json({
                        msg: '🌟 Registration successful! Welcome to AniWeeab. Dive into the world of anime and manga - your new favorite stories await! 📚🎉',
                        token: token
                    });
                } catch (error) {
                    res.status(400).json({
                        statusCode: 400,
                        msg: error.message
                    });
                }
            }
        }
    } else {
        res.status(400).json({
            statusCode: 400,
            msg: 'Please, fill all the fields.'
        });
    }
}


export const userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        const user = await userModel.findOne({ email: email });

        if (!user) {
            res.status(400).json({
                statusCode: 400,
                msg: 'User not found. Please check the email address and try again.'
            });
        } else {
            const passCheck = await verifyPassword(password, user.password);

            if (!passCheck) {
                res.status(400).json({
                    statusCode: 400,
                    msg: 'Sorry, the password you entered is incorrect. Please double-check your password and try again.'
                });
            } else {
                const token = tokenGenerator(user._id, process.env.JWT_SECRET, '30d');

                res.status(200).json({
                    msg: `🎉 Welcome back, ${user.name}. Let the adventures continue! 🌟`,
                    username: user.name,
                    token: token
                });
            }
        }
    } else {
        res.status(400).json({
            statusCode: 400,
            msg: 'Please, fill all the fields.'
        });
    }
}


export const sendResetPasswordLink = async (req, res) => {
    const { email } = req.body;

    if (email) {
        const user = await userModel.findOne({ email: email });

        if (user) {
            try {
                const resetLink = resetLinkGenerate(user._id);

                await transporter.sendMail({
                    from: process.env.APP_ID,
                    to: email,
                    subject: 'Password Reset Request',
                    html: `
                    <!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <title>AniWeeab - Password Reset</title>
                        </head>
                        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #fff; margin: 0 auto; padding: 20px;">
                                <tr>
                                    <td>
                                        <h1 style="font-size: 24px; font-weight: bold; color: #ff5500;">AniWeeab</h1>
                                        <p style="font-size: 18px;">Password Reset Instructions</p>
                                        <p>Hello ${user.name},</p>
                                        <p>You're just a step away from exploring your favorite anime again! You recently requested a password reset for your AniWeeab account. To reset your password and regain access to your account, please follow the steps below:</p>
                                        <ol>
                                            <li>
                                                Click on the following link to reset your password. This link is valid for <span style="font-weight: bold; color: #ff5500;">15 minutes</span>:
                                                <a href="${resetLink}" target="_blank" style="display: inline-block; background-color: #ff5500; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 10px 0;">Reset Password</a>
                                            </li>
                                            <li>You will be directed to a page where you can set a new password for your account. Please choose a strong and secure password.</li>
                                        </ol>
                                        <p>If you didn't request this password reset, please disregard this email. Your account's security is important to us.</p>
                                        <p>Thank you for using Anime Website, and enjoy exploring your favorite anime and manga!</p>
                                        <p style="font-size: 16px; font-style: italic; color: #777;">"Anime is not a genre, it's an art." - Hayao Miyazaki</p>
                                        <p style="font-weight: bold; color: #ff5500;">Best regards,<br>AniWeeab Team</p>
                                    </td>
                                </tr>
                            </table>
                        </body>
                    </html>
                    `,
                });


                res.status(200).json({
                    msg: "🚀 Reset link sent! Navigate to your email address and regain access to the excitement! 🔑🌟"
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
                msg: "User not found. Please check the email address and try again."
            });
        }
    } else {
        res.status(400).json({
            statusCode: 400,
            msg: "Sorry, but we need your email address to initiate a password reset. Please enter your email address in the provided field."
        });
    }
}



export const resetUserPassword = async (req, res) => {
    const { password, confirmPassword } = req.body;
    const { id, token } = req.params;


    if (password && confirmPassword) {
        const pass_len = password.length;

        if (pass_len < 8 || pass_len > 25) {
            res.status(400).json({
                statusCode: 400,
                msg: 'Password must be between 8 and 25 characters.'
            });
        } else if (password !== confirmPassword) {
            res.status(400).json({
                statusCode: 400,
                msg: 'Passwords do not match. Please make sure your passwords match.'
            });
        } else {
            try {
                const user = await userModel.findById(base64ToToken(id));

                verifyToken(token, user._id + process.env.JWT_SECRET);
                const hashPassword = await encrpytPassword(password);

                await userModel.findByIdAndUpdate(user._id, {
                    $set: {
                        password: hashPassword
                    }
                });

                res.status(200).json({
                    msg: '🎉 Your password has been successfully reset. You can now log in with your new password.'
                });
            } catch (error) {
                res.status(400).json({
                    statusCode: 400,
                    msg: error.message
                });
            }
        }
    } else {
        res.status(400).json({
            statusCode: 400,
            msg: 'Please, fill all the fields.'
        });
    }
}


export const updateUserPassword = async (req, res) => {
    const { password, confirmPassword } = req.body;

    if (password && confirmPassword) {
        const pass_len = password.length;

        if (pass_len < 8 || pass_len > 25) {
            res.status(400).json({
                statusCode: 400,
                msg: 'Password must be between 8 and 25 characters.'
            });
        } else if (password !== confirmPassword) {
            res.status(400).json({
                statusCode: 400,
                msg: 'Passwords do not match. Please make sure your passwords match.'
            });
        } else {
            const hashPassword = await encrpytPassword(password);

            await userModel.findByIdAndUpdate(req.user._id, {
                $set: {
                    password: hashPassword
                }
            });
            res.status(200).json({
                msg: "🎉 Password updated successfully!!"
            });
        }
    } else {
        res.status(400).json({
            statusCode: 400,
            msg: 'Please, fill all the fields.'
        });
    }
}


export const userLogged = async (req, res) => {

    if (req.user._id) {
        const token = await tokenGenerator(req.user._id, process.env.JWT_SECRET, '30d');
        const user = {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }

        res.status(200).json({
            msg: 'User is already logged in and Token is renewed successfully!!',
            user,
            token
        });
    } else {
        res.status(400).json({
            statusCode: 400,
            msg: 'You are not logged in!!'
        });
    }
}


export const deleteUserAccount = async (req, res) => {
    if (req.user._id) {
        try {
            await favoriteModel.deleteMany({ user: req.user._id });

            await reviewModel.deleteMany({ user: req.user._id });

            const user = await userModel.findByIdAndDelete({ _id: req.user._id });

            res.status(200).json({
                msg: "🌟 Account Deletion Successful! Until then, may your journey be as epic as a shonen finale. Sayonara,",
                username: user.name
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
