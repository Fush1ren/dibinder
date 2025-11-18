import express from 'express';
import cors from "cors";
import config from './config';
import passport from 'passport';
import authRouter from './routes/auth';
import passportConfig from './config/passport';
import { connectDB } from './config/db';
import userRouter from './routes/user';

connectDB();

const app = express();

app.use(
    cors({
        origin: config.APP_CLIENT_URL,
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(passport.initialize());

passportConfig(passport);

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(3000, () => {
    console.log(`Back-End listening on port ${3000}`);
});