export const uploadedPhotoPrefix = "data:image/webp;base64,";
export const productPhotoRoute = "/foto-produk/";

export function productPhotoSrc(id: number, fotoUrl: string) {
  return fotoUrl.startsWith(uploadedPhotoPrefix) ? `${productPhotoRoute}${id}` : fotoUrl;
}
