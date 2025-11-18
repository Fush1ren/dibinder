import express from 'express';
import passport from 'passport';
import { ChangePasswordRequestParam, ErrorCatch, ResendOtpRequestParam, UserData, UserRequest, VerifyOtpRequestParam } from '../types';
import Users from '../schema/users';
import Otp from '../schema/otp';
import bcrypt from "bcryptjs";
import { sendVerificationChangePassword } from '../config/email';

const userRouter = express.Router();

userRouter.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = req?.user as UserRequest;

        const userData = await Users.findById(user?.id).lean();

        if (!userData) {
            return res.status(401).json({
                error: true,
                message: 'User is not Found.'
            });
        }

        const { password, ...data } = userData;

        res.status(200).json({
            data
        });
    } catch (e) {
        res.status(500).json({
            error: true,
            message: (e as ErrorCatch)?.message || "Failed to get profile user"
        });
    }
});

userRouter.patch('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = req?.user as UserRequest;

        const body = req.body as UserData;

        if (!body?.name && !body?.email && !body?.photoUrl) {
            return res.status(400).json({
                error: true,
                message: 'User Data cannot be empty!'
            });
        }

        const {...updateData} = req.body;

        const doc = await Users.findOneAndUpdate(
            {
                _id: user?.id
            },
            {
                $set: updateData
            },
            {
                new: true,
                runValidators: true
            }
        ).lean();

        if (!doc) {
            return res.status(404).json({ 
                error: true,
                message: "User is Not Found" 
            });
        }

        res.status(200).json({
            data: doc
        });
        
    } catch (e) {
        res
        .status(500)
        .json({ 
            error: true,
            messsage: (e as ErrorCatch).message || "Failed to update user" 
        });
    }
});

userRouter.post('/send-verification', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = req?.user as UserRequest;

        const existingUser = await Users.findById(user?.id).lean();

        if (!existingUser) {
            return res.status(404).json({
                error: true,
                message: "User not found" 
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.findOneAndUpdate(
            { email: existingUser.email },
            {
                $set: {
                    otp: otp,
                    createdAt: new Date(),
                },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        await sendVerificationChangePassword(existingUser?.email as string, otp);

        res.status(200).json({
            message: "Verification code sent to your email. Please verify to change password.",
            data: {
                email: existingUser.email,
            }
        });
    } catch (e) {
        console.error("Signup error:", e);
        res.status(500).json({
            error: true,
            message: "Failed to send verification email. " + (e as ErrorCatch)?.message,
        });
    }
});

userRouter.post('/verify-otp', passport.authenticate('jwt', { session: false }), async (req: VerifyOtpRequestParam, res) => {
    try {
        const { email, otp } = req.body;

        const otpEntry = await Otp.findOne({ email });

        if (!otpEntry) {
            return res
            .status(400)
            .json({
                erorr: true,
                message: "Invalid or expired OTP. Please try again." 
            });
        }

        if (otpEntry.otp !== otp) {
            return res.status(400).json({
                error: true,
                message: "Invalid OTP code." 
            });
        }

        return res.status(200).json({ message: "OTP verified successfully." });
    } catch (e) {
        console.error("OTP Verification error:", e);
        res.status(500).json({ message: (e as ErrorCatch)?.message });
    }
});

userRouter.patch('/change-password', passport.authenticate('jwt', { session: false }), async (req: ChangePasswordRequestParam, res) => {
    try {
        const user = req?.user as UserRequest;

        const { newPassword } = req.body;

        const dataUser = await Users.findById(user?.id);

        if (!dataUser) {
            return res.status(400).json({
                error: true,
                message: 'User not found.'
            })
        }

        const hashNewPassword = await bcrypt.hash(newPassword, 10);

        dataUser.password = hashNewPassword;

        await dataUser.save();

        res.status(200).json({ message: "Password changed successfully." });
    } catch (e) {
        res.status(500).json({
            error: true,
            message: (e as ErrorCatch)?.message 
        });
    }
});

userRouter.post('/resend-otp', passport.authenticate('jwt', { session: false }), async (req: ResendOtpRequestParam, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: true,
                message: "Email cannot be empty."
            })
        }
        
        const lowercasedEmail = email.toLowerCase();

        const otpEntry = await Otp.findOne({ email: lowercasedEmail });

        if (!otpEntry) {
            return res.status(404).json({
                error: true,
                message: "Failed to resend OTP. Try again!",
            });
        }

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        otpEntry.otp = newOtp;
        otpEntry.createdAt = new Date();
        await otpEntry.save();

        await sendVerificationChangePassword(lowercasedEmail, newOtp);

        res.status(200).json({
            message: "A new verification code has been sent to your email.",
        });
    } catch (e) {
        res.status(500).json({
            error: true,
            message: "Failed to resend OTP. " + (e as ErrorCatch)?.message 
        });
    }
});

export default userRouter;