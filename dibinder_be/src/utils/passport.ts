import passport from 'passport';
import { Strategy as Auth0Strategy } from "passport-auth0";
import dotenv from "dotenv";
dotenv.config();

const domain = process.env.AUTH_DOMAIN!;
const clientID = process.env.AUTH_CLIENT_ID!;
const clientSecret = process.env.AUTH_CLIENT_SECRET!;
const callbackURL = process.env.AUTH_CALLBACK_URL!;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

passport.use(
  new Auth0Strategy(
    {
      domain,
      clientID,
      clientSecret,
      callbackURL,
    },
    (accessToken: string, refreshToken: string, extraParams: any, profile: any, done: any) => {
      return done(null, { profile, accessToken, refreshToken, extraParams });
    }
  )
);

export default passport;