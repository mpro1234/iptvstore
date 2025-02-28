// src/services/uploadService.ts
import cloudinary from "../config/cloudinary";

interface UploadResult {
  url: string;
  public_id: string;
}

export const uploadImage = async (
  file: Express.Multer.File
): Promise<UploadResult> => {
  const result = await cloudinary.uploader.upload(file.path, {
    upload_preset: "your_upload_preset",
  });
  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};
