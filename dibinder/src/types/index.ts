export type ConfigEnv = {
    api_url: string;
}

export type RouteMeta = {
    useNavbar?: boolean;
    title?: string;
}

export type ErrorsForm = {
    message: string;
}

export interface LoginInputValue {
    email: string;
    password: string;
}

export type ErrorCatch = {
    name: string;
    message: string;
    stack?: string;
}

export type OtpFormProps = {
    email: string;
    reason: string;
}

export interface OtpInput {
    otp: string;
}

export interface RegisterInputValue {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
}

export interface DecodedToken {
    id: string;
    name: string;
    email: string;
    photoUrl?: string;
    iat: number;
    exp: number;
}
