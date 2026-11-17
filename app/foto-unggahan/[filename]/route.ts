import { readFile } from "node:fs/promises";
import { uploadedPhotoPath } from "../../../lib/product-upload";

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const path = uploadedPhotoPath((await params).filename);
  if (!path) return new Response(null, { status: 404 });

  try {
    const photo = await readFile(path);
    return new Response(photo, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return new Response(null, { status: 404 });
    throw error;
  }
}
