import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const directory = join(process.cwd(), "public", "uploads");
export const uploadUrlPrefix = "/foto-unggahan/";
export const maxPhotoBytes = 5 * 1024 * 1024;

export function uploadedPhotoPath(filename: string) {
  if (!/^[a-f0-9-]{36}\.webp$/.test(filename)) return null;
  return join(directory, filename);
}

export async function saveProductPhoto(file: File) {
  if (file.size > maxPhotoBytes) return null;

  let result: Buffer;
  try {
    const image = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 25_000_000 });
    const { format } = await image.metadata();
    if (format !== "jpeg" && format !== "png" && format !== "webp") return null;
    result = await image.rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
  } catch {
    return null;
  }

  await mkdir(directory, { recursive: true });
  const filename = `${randomUUID()}.webp`;
  const path = join(directory, filename);
  try {
    await writeFile(path, result, { flag: "wx" });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") await unlink(path).catch(() => {});
    throw error;
  }

  return { url: uploadUrlPrefix + filename, path };
}
