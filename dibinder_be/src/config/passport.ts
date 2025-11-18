import { PassportStatic } from "passport";
import { Strategy as JwtStrategy, ExtractJwt, WithSecretOrKey } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as Auth0Strategy } from "passport-auth0";
import { PayloadJwtStrategy, UserSchema } from "../types";
import bcrypt from "bcryptjs";
import config from ".";
import Users from "../schema/users";

export default function (passport: PassportStatic) {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            async (email, password, done) => {
                try {
                    const user = await Users.findOne({ email: email?.toLowerCase()} as UserSchema) as UserSchema;
                    if (!user) {
                        return done(null, false, {
                            message: 'Your email is incorrect.'
                        });
                    };

                    const isMatch = await bcrypt.compare(password, user?.password);

                    if (!isMatch) {
                        return done (null, false, {
                            message: 'Your password is incorrect.'
                        });
                    };

                    return done(null, user);
                } catch (e) {
                    return done(e);
                }
            }
        )
    )

    const options = {} as WithSecretOrKey;
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    options.secretOrKey = config.JWT_SECRET;

    passport.use(
        new JwtStrategy(options, async (payload: PayloadJwtStrategy, done) => {
            try {
                const user = await Users.findById(payload?.id);

                if (!user) {
                    return done(null, false)
                };

                return done(null, user);
            } catch (e) {
                return done (e, false);
            }
        })
    );

    passport.use(
        new Auth0Strategy(
            {
                domain: config.AUTH0_DOMAIN,
                clientID: config.AUTH0_CLIENT_ID,
                clientSecret: config.AUTH0_CLIENT_SECRET,
                callbackURL: config.AUTH0_CALLBACK_URL,
            },
            async (_accessToken, _refeshToken, _params, profile, done) => {
                try {
                    const email = profile?.emails && profile?.emails[0] ? profile?.emails[0]?.value?.toLowerCase() : null;

                    if (!email) {
                        return done(
                            new Error('Email is not provided by authentication provider.'),
                            null
                        );
                    };

                    let user = await Users.findOne({
                        email: email
                    });
                    
                    if (!user) {
                        user = new Users({
                            name: profile?.displayName,
                            email: email,
                            password: 'sso_login_no_password',
                            photoUrl: profile?.profileUrl
                        });

                        await user.save();
                    }

                    return done(null, user);
                } catch (e) {
                    return done(e);
                }
            }
        )
    )
}