import session from "express-session";
import config from ".";
import MongoStore from "connect-mongo";

export const sessionMiddleware = session({
    proxy: true,
    secret: config.SESSION_SECRET || 'a-very-secret-key-for-sso',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: config.APP_MODE === 'production',
        sameSite: config.APP_MODE === 'production' ? 'none' : 'lax',
        httpOnly: true,
        maxAge: 600000 // 10 Minutes
    },
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${config.MONGODB_USERNAME}:${config.MONGODB_PASSWORD}@${config.MONGODB_URL}`,
        ttl: 14 * 24 * 60 * 60, // 14 days
        autoRemove: 'native'
    }),
});