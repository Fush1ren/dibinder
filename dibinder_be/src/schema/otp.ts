import { model, Schema, SchemaDefinition } from "mongoose";
import { OtpSchema } from "../types";

const otpSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        otp: {
            type: String,
            required: true
        },
        user: {
            name: {
                type: String,
                required: false
            },
            password: {
                type: String,
                required: false
            }
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            expires: 600 // 600 seconds = 10 Minutes
        }
    } as SchemaDefinition<OtpSchema>
);

const Otp = model("Otp", otpSchema);

export default Otp;