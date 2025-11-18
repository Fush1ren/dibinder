import { ConfigData } from '../types';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    APP_MODE: process.env.APP_MODE,
    APP_CLIENT_URL: process.env.APP_CLIENT_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    MONGODB_URL: process.env.MONGODB_URL,
    MONGODB_USERNAME: process.env.MONGODB_USERNAME,
    MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: parseInt(process.env.SMTP_PORT || "587", 10),
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_SENDER: process.env.SMTP_SENDER,
    JWT_SECRET: process.env.JWT_SECRET,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL,
    SESSION_SECRET: process.env.SESSION_SECRET
} as ConfigData;

export default config;