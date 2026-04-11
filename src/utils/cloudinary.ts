import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envConfig } from "../config/env";

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary using their SDK.
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  fileName: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // Automatically detect file type (PDF, image, etc.)
        public_id: fileName.replace(/\.[^/.]+$/, ""), // Remove extension
      },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload error:", error);
          return reject(error || new Error("Upload failed"));
        }
        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;
