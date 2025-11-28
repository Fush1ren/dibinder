import passport from 'passport';
import { Strategy as Auth0Strategy } from "passport-auth0";
import config from '../config';

const domain = config.AUTH0_DOMAIN!;
const clientID = config.AUTH0_CLIENT_ID!;
const clientSecret = config.AUTH0_CLIENT_SECRET!;
const callbackURL = config.AUTH0_CALLBACK_URL!;

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