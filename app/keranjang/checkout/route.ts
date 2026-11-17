import { cartProductSelect, parseCartIds } from "../../../lib/cart";
import { formatRupiah, formatUkuran } from "../../../lib/format";
import { prisma } from "../../../lib/prisma";
import { storeName } from "../../../lib/store-name";

export async function POST(request: Request) {
  const form = await request.formData();
  const nama = String(form.get("nama") ?? "").trim();
  const hp = String(form.get("hp") ?? "").trim();
  const alamat = String(form.get("alamat") ?? "").trim();
  const ids = parseCartIds(String(form.get("produk") ?? ""));
  const digits = hp.replace(/\D/g, "");

  if (!nama || nama.length > 100 || !alamat || alamat.length > 500 ||
      hp.length > 32 || !/^\+?[\d ().-]+$/.test(hp) || !/^\d{7,15}$/.test(digits)) {
    return new Response("Periksa nama, nomor HP, dan alamat pengiriman, lalu coba lagi dari keranjang.", { status: 400 });
  }

  if (!ids.length) {
    return new Response("Pilih barang yang tersedia untuk melanjutkan checkout.", { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: ids }, status: "tersedia" },
    select: cartProductSelect,
  });
  if (products.length !== ids.length) {
    return new Response("Ketersediaan barang telah berubah. Muat ulang keranjang sebelum checkout.", { status: 409 });
  }

  const byId = new Map(products.map((product) => [product.id, product]));
  const items = ids.flatMap((id) => {
    const product = byId.get(id);
    if (!product) return [];
    const ukuran = formatUkuran(product.panjangCm, product.lebarCm);
    return [`- ${product.nama} (ukuran ${product.ukuranLabel}, ${ukuran}) — ${formatRupiah(product.harga)}`];
  });
  const total = products.reduce((sum, product) => sum + product.harga, 0);
  const pesan = [
    `Halo ${storeName}, saya ingin memesan barang berikut:`,
    ...items,
    "",
    `Total harga: ${formatRupiah(total)}`,
    `Nama Pembeli: ${nama}`,
    `Nomor HP: ${hp}`,
    `Alamat Pengiriman: ${alamat}`,
  ].join("\n");

  const nomor = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "6281234567890";
  if (!/^[1-9]\d{6,14}$/.test(nomor)) {
    return new Response("Nomor WhatsApp toko tidak valid. Hubungi pengelola toko.", { status: 500 });
  }

  const url = new URL(`https://wa.me/${nomor}`);
  url.searchParams.set("text", pesan);
  return Response.redirect(url, 303);
}
