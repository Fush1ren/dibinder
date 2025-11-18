import nodemailer from 'nodemailer';
import config from '.';
import Mail from 'nodemailer/lib/mailer';

const missingEnv = [
    config?.SMTP_HOST,
    config?.SMTP_PORT,
    config?.SMTP_USERNAME,
    config?.SMTP_PASSWORD,
    config?.SMTP_SENDER,
]?.filter(
    (env) => !env
);

const checkSMTPConfig = () => {
    if (missingEnv?.length > 0) {
        console.warn(
            `WARNING: Missing required SMTP Environment variables : ${missingEnv?.join(', ')}. SMTP functionality will be disabled`
        )
    }

}

checkSMTPConfig()

const transporter = nodemailer.createTransport({
    host: config?.SMTP_HOST,
    port: config?.SMTP_PORT,
    secure: config?.SMTP_PORT === 465,
    auth: {
        user: config?.SMTP_USERNAME,
        pass: config?.SMTP_PASSWORD,
    },
});

export const sendVerificationEmail = async (to: string, otp: string) => {
    try {
        checkSMTPConfig();

        const mailOptions = {
            from: {
                name: 'DiBinder',
                address: config?.SMTP_SENDER,
            },
            to: to,
            subject: 'Your Verification Code for DiBinder',
            html: `<p>Hi There,</p>
                <p>Thank you for registering at DiBinder. Use the following code to verifiy your email address: </p>
                <h2 style="text-align:center; letter-spacing: 2px;"><b>${otp}</b></h2>
                <p>This code will expires in 10 minutes.</p>
            `,
        } as Mail.Options;

        await transporter.sendMail(mailOptions)
    } catch (e) {
        console.error(e)
    }
}

export const sendVerificationChangePassword = async (to: string, otp: string) => {
    try {
        checkSMTPConfig();

        const mailOptions = {
            from: {
                name: 'DiBinder',
                address: config?.SMTP_SENDER,
            },
            to: to,
            subject: 'Your Verification Code to Change Password for DiBinder',
            html: `<p>Hi there,</p>
                <p>You requested to change your password at DiBinder. Use the following code to verify your email address:</p>
                <h2 style="text-align:center; letter-spacing: 2px;"><b>${otp}</b></h2>
                <p>This code will expires in 10 minutes.</p>
            `
        } as Mail.Options;

        await transporter.sendMail(mailOptions);
    } catch (e) {
        console.error(e);
    }
}