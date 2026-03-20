import axios from "axios";
import { envConfig } from "../config/env";

/**
 * Uploads an image buffer to ImgBB and returns the hosted URL.
 * @param buffer The image file buffer.
 * @returns The URL of the uploaded image.
 */
export const uploadToImgBB = async (
  buffer: Buffer,
): Promise<{ url: string; id: string }> => {
  const apiKey = envConfig.IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error(
      "IMGBB_API_KEY is not configured in environment variables.",
    );
  }

  const formData = new FormData();
  formData.append("image", buffer.toString("base64"));

  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      formData,
    );

    if (response.data && response.data.success) {
      return {
        url: response.data.data.url,
        id: response.data.data.id,
      };
    } else {
      throw new Error("Failed to upload image to ImgBB.");
    }
  } catch (error) {
    console.error("ImgBB Upload Error:", error);
    throw new Error("Error uploading image to ImgBB.", { cause: error });
  }
};

/**
 * Deletes an image from ImgBB using its ID.
 * @param id The ID of the image to delete.
 * @returns A boolean indicating success.
 */
export const deleteFromImgBB = async (id: string): Promise<boolean> => {
  const apiKey = envConfig.IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error(
      "IMGBB_API_KEY is not configured in environment variables.",
    );
  }

  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/delete?key=${apiKey}`,
      { id },
    );

    return response.data && response.data.success;
  } catch (error) {
    console.error("ImgBB Delete Error:", error);
    return false;
  }
};
