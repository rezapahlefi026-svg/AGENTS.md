import sharp from "sharp";
import { uploadedPhotoPrefix } from "./product-photo";

export const maxPhotoBytes = 4 * 1024 * 1024;

export async function compressProductPhoto(file: File) {
  if (file.size > maxPhotoBytes) return null;

  try {
    const image = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 25_000_000 });
    const { format } = await image.metadata();
    if (format !== "jpeg" && format !== "png" && format !== "webp") return null;

    const result = await image
      .rotate()
      .resize({ width: 1280, height: 1280, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 78 })
      .toBuffer();

    return uploadedPhotoPrefix + result.toString("base64");
  } catch {
    return null;
  }
}
