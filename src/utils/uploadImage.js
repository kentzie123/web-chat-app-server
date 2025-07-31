import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (filePath) => {
  try {
    console.log('Uploading image from:', filePath);
    const stats = fs.statSync(filePath);
    const fileSizeInMB = stats.size / (1024 * 1024);

    if (fileSizeInMB > 10) {
      return { success: false, error: 'File size exceeds 10MB limit.' };
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'web-chat-app',
    });

    return { success: true, url: result.secure_url };
  } catch (error) {
    console.error('Upload failed:', error.message);
    return { success: false, error: error.message };
  }
};