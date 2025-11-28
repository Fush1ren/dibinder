import express from 'express';
import passport from 'passport';
import { ChangePasswordRequestParam, ErrorCatch, UserData, UserRequest } from '../types';
import Users from '../schema/users';
import bcrypt from "bcryptjs";

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

export default userRouter;