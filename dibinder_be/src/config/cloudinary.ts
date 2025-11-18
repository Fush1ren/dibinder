import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { NextFunction, Response } from "express";
import { UploadParams } from "../types";
import multer from "multer";
import streamifier from "streamifier";
import config from ".";

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();

export const upload = multer({ storage });

export const handleUpload = (folderName: string) => (req: UploadParams, res: Response, next: NextFunction) => {
    if (!req?.file) {
        return res.status(400).json({
            error: true,
            message: "No file uploaded."
        });
    };

    const uploadStream = cloudinary.uploader.upload_stream({
        folder: folderName, resource_type: 'auto',
    }, (e, result) => {
        if (e) return res.status(500).json({
            error: true,
            message: 'Upload to Cloudynary failed', e
        });

        req.cloudinary = result as UploadApiResponse;
        next();
    })

    streamifier.createReadStream(req?.file?.buffer).pipe(uploadStream);
}