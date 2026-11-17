import { uploadedPhotoPrefix } from "../../../lib/product-photo";
import { prisma } from "../../../lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[1-9]\d{0,9}$/.test(id) || Number(id) > 2147483647) {
    return new Response(null, { status: 404 });
  }

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    select: { fotoUrl: true },
  });
  const fotoUrl = product?.fotoUrl;
  if (!fotoUrl?.startsWith(uploadedPhotoPrefix)) return new Response(null, { status: 404 });

  return new Response(Buffer.from(fotoUrl.slice(uploadedPhotoPrefix.length), "base64"), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
