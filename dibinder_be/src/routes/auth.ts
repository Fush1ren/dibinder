import { NextFunction, Request, Response, Router } from "express";
import { ErrorCatch, InfoPassport, OtpSchema, ResendOtpRequestParam, SignUpRequestParam, User, VerifyOtpRequestParam } from "../types";
import { sendVerificationEmail } from "../config/email";
import { checkValueIsNotEmpty } from "../utils/data";
import { sessionMiddleware } from "../config/session";
import bcrypt from "bcryptjs";
import config from "../config";
import jwt from "jsonwebtoken";
import Users from "../schema/users";
import Otp from "../schema/otp";
import passport from "passport";

const authRouter = Router();

authRouter.post('/singup', async (req: SignUpRequestParam, res: Response) => {
    try {
        const { name, email, password } = req.body;

        checkValueIsNotEmpty(res, [name, email, password]);

        const lowerCasedEmail = email?.toLowerCase();

        const existingUser = await Users.findOne({
            email: lowerCasedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                error: true,
                message: 'Email address already in use'
            });
        }

        await Otp.deleteOne({
            email: lowerCasedEmail
        });

         const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const hashedPassword = await bcrypt.hash(password, 10);

        const newOtpEntry = new Otp({
            email: lowerCasedEmail,
            otp,
            user: {
                name,
                password: hashedPassword
            }
        });

        await newOtpEntry.save();

        await sendVerificationEmail(lowerCasedEmail, otp);

        res.status(200).json({
            message: 'Verification code send to your email. Please verifiy to complete registration.',
            data: {
                email: lowerCasedEmail,
            },
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: true,
            message: "Failed to send verification email." + (e as ErrorCatch)?.message 
        });
    };
});

authRouter.post('/verify-otp', async (req: VerifyOtpRequestParam, res: Response) => {
    try {
        const { email, otp } = req.body;

        checkValueIsNotEmpty(res, [email, otp]);

        const lowercasedEmail = email.toLowerCase();

        const otpEntry = await Otp.findOne({ email: lowercasedEmail }) as OtpSchema;

        if (!otpEntry) {
            return res.status(400).json({
                error: true,
                message: "Invalid or expired OTP. Please try signing up again.",
            });
        }

        if (otpEntry.otp !== otp) {
            return res.status(400).json({ 
                error: true,
                message: "Invalid OTP code." 
            });
        }

        const newUser = new Users({
            name: otpEntry.user?.name,
            email: otpEntry.email,
            password: otpEntry.user.password,
        });

        await newUser.save();

        await Otp.deleteOne({ email: lowercasedEmail });

        res.status(200).json({
            message: 'User registered successfully. You can now sign in.'
        });
    } catch (e) {
        console.error("OTP Verification error:", e);
        res.status(500).json({ 
            error: true, 
            message: (e as ErrorCatch)?.message 
        });
    }
});

authRouter.post("/signin", (req: Request, res: Response, next: NextFunction) => {
    try {
        passport.authenticate("local", { session: false }, (err: any, user: User, info: InfoPassport) => {
            if (err || !user) {
                return res.status(400).json({ 
                    error: true,
                    message: info ? info.message : "Login failed", 
                    // user 
                });
            }

            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }

                const payload = { id: user._id, name: user.name, email: user.email };

                const token = jwt.sign(payload, config.JWT_SECRET, {
                    expiresIn: "1d",
                });

                return res.status(200).json({
                    success: true,
                    user_id: user._id,
                    name: user.name,
                    photoUrl: user.photoUrl,
                    token: `${token}`,
                });
            })
        })(req, res, next);
    } catch (e) {
        console.error("User login error:", e);
        res.status(500).json({ 
            error: true, 
            message: (e as ErrorCatch)?.message 
        });
    }
});

authRouter.get(
    "/google", 
    sessionMiddleware,

    // @ts-ignore
    passport.authenticate('auth0', {
        scope: "openid email profile",
        connection: "google-oauth2",
    }),
);

authRouter.get(
    "/callback",
    sessionMiddleware,
    passport.authenticate("auth0", {
        failureRedirect: "/login-failed",
        session: false,
    }),
    (req, res) => {
        const user = req.user as User;
        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            photoUrl: user.photoUrl,
        };
        const token = jwt.sign(payload, config.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.redirect(`${config.APP_CLIENT_URL}/auth/callback?token=${token}`);
    }
);

authRouter.get("/logout", sessionMiddleware, (req, res, next: NextFunction) => {
    const logoutURL = new URL(`https://${config.AUTH0_DOMAIN}/v2/logout`);
    logoutURL.searchParams.set("client_id", config.AUTH0_CLIENT_ID);
    logoutURL.searchParams.set("returnTo", `${config.APP_CLIENT_URL}/login`);

    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.redirect(logoutURL.toString());
    });
});

authRouter.post("/resend-otp", async (req: ResendOtpRequestParam, res) => {
    try {
        const { email } = req.body;
        const lowercasedEmail = email.toLowerCase();

        const otpEntry = await Otp.findOne({ email: lowercasedEmail });

        if (!otpEntry) {
            return res.status(404).json({
                error: true,
                message:
                "No pending registration found for this email. Please sign up first.",
            });
        }

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        otpEntry.otp = newOtp;
        otpEntry.createdAt = new Date();
        await otpEntry.save();

        await sendVerificationEmail(lowercasedEmail, newOtp);

        res.status(200).json({
            message: "A new verification code has been sent to your email.",
        });
    } catch (e) {
        res.status(500).json({ 
            error: true,
            message: "Failed to resend OTP. " + (e as ErrorCatch)?.message 
        });
    }
})

export default authRouter;