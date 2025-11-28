import { NextFunction, Request, Response, Router } from "express";
import { ErrorCatch, InfoPassport, SignUpRequestParam, User } from "../types";
import { checkValueIsNotEmpty } from "../utils/data";
import { sessionMiddleware } from "../config/session";
import bcrypt from "bcryptjs";
import config from "../config";
import jwt from "jsonwebtoken";
import Users from "../schema/users";
import passport from "passport";

const authRouter = Router();

authRouter.post('/signup', async (req: SignUpRequestParam, res: Response) => {
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Users({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(200).json({
            message: 'User registered successfully. You can now sign in.',
            data: {
                email: lowerCasedEmail,
            },
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: true,
            message: "Failed to register user." + (e as ErrorCatch)?.message 
        });
    };
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

export default authRouter;