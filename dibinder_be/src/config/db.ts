import mongoose from "mongoose";
import config from ".";

export const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${config.MONGODB_USERNAME}:${config.MONGODB_PASSWORD}@${config.MONGODB_URL}`, {
            dbName: config.DB_NAME
        });
        console.log("✅ MongoDB Connected");
    } catch (e) {
        console.error("❌ MongoDB Connection Error:", e);
        // process.exit(1);
    }
}