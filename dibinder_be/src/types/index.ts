import { UploadApiResponse } from "cloudinary";
import { Request } from "express";

export type ConfigData = {
    APP_MODE: string;
    APP_CLIENT_URL: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    MONGODB_URL: string;
    DB_NAME: string;
    MONGODB_USERNAME: string;
    MONGODB_PASSWORD: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USERNAME: string;
    SMTP_PASSWORD: string;
    SMTP_SENDER: string;
    JWT_SECRET: string;
    AUTH0_DOMAIN: string;
    AUTH0_CLIENT_ID: string;
    AUTH0_CLIENT_SECRET: string;
    AUTH0_CALLBACK_URL: string;
    SESSION_SECRET: string;
}

export type UserSchema = {
    email: string;
    password: string;
    name: string;
    photoUrl: string | null;
}

export type UploadParams = Request & {
    cloudinary: UploadApiResponse;
}

export type PayloadJwtStrategy = {
    id: string | number;
}

export type ErrorCatch = {
    name: string;
    message: string;
    stack?: string;
}

export type InfoPassport = {
    message: string;
}

export type SignUpRequestParam = Omit<Request, 'body'> & {
    body: {
        name: string;
        email: string;
        password: string;
    }
}


export type ChangePasswordRequestParam = Omit<Request, 'body'> & {
    body: {
        newPassword: string;
    }
}

export type UserRequest = {
    id: string;
}

export type UserData = {
    id: string;
    name: string;
    email: string;
    photoUrl: string | null;
}

export type User = {
    _id: string;
    name: string;
    email: string;
    photoUrl: string | null;
}

export type Lists = {
    name: string;
    color: string;
    user: string;
}

export type Task = {
    name: string;
    description: string;
    done: boolean;
    list?: string;
    startDate: Date | string;
    dueDate: Date | string;
    subTask: {
        name: string;
        done: boolean;
    }[]
    user: string;
}