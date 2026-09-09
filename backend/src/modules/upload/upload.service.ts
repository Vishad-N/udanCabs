import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'udancabs',
          resource_type: 'auto',
        },
        (error, result: UploadApiResponse) => {
          if (error) {
            this.logger.error(`Cloudinary upload failed: ${error.message}`);
            return reject(error);
          }
          resolve({
            url: result.secure_url,
            filename: result.public_id,
          });
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadPdfBuffer(buffer: Buffer, filename: string): Promise<{ url: string; filename: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'udancabs/receipts',
          resource_type: 'raw',
          public_id: filename,
        },
        (error, result: UploadApiResponse) => {
          if (error) {
            this.logger.error(`Cloudinary upload failed: ${error.message}`);
            return reject(error);
          }
          resolve({
            url: result.secure_url,
            filename: result.public_id,
          });
        },
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<{ urls: string[] }> {
    const results = await Promise.all(files.map((file) => this.uploadFile(file)));
    return {
      urls: results.map((r) => r.url),
    };
  }

  async deleteFile(publicId: string): Promise<{ deleted: boolean }> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result === 'ok') {
        return { deleted: true };
      }
      return { deleted: false };
    } catch (error) {
      this.logger.error(`Cloudinary delete failed: ${error.message}`);
      return { deleted: false };
    }
  }
}
