import Link from "next/link";
import { notFound } from "next/navigation";
import { formatRupiah, formatUkuran } from "../../../lib/format";
import { productPhotoSrc } from "../../../lib/product-photo";
import { prisma } from "../../../lib/prisma";
import { ProductPhoto } from "../../product-photo";
import { AddToCart } from "../../cart-controls";

export const dynamic = "force-dynamic";

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[1-9]\d{0,9}$/.test(id) || Number(id) > 2147483647) notFound();

  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!product) notFound();

  const soldOut = product.status === "sold_out";

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-7 sm:px-8 sm:pt-10">
      <Link href="/#katalog" className="text-sm font-semibold text-accent hover:underline hover:underline-offset-4">
        <span aria-hidden="true">← </span>Kembali ke katalog
      </Link>
      <article className="mt-5 grid items-start gap-7 md:grid-cols-2 md:gap-12 lg:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-sand">
          <ProductPhoto nama={product.nama} fotoUrl={productPhotoSrc(product.id, product.fotoUrl)} soldOut={soldOut} sizes="(min-width: 768px) 50vw, 100vw" priority />
        </div>
        <div>
          <p className="text-sm font-semibold text-muted">{product.kategori}</p>
          <h1 className="mt-2 font-display text-4xl leading-tight tracking-tight sm:text-5xl">{product.nama}</h1>
          <p className="mb-6 mt-3 text-xl font-semibold text-accent">{formatRupiah(product.harga)}</p>
          <dl className="grid gap-x-4 gap-y-5 border-y border-line py-5 sm:grid-cols-2">
            <div><dt className="text-sm text-muted">Ukuran label</dt><dd className="mt-1 font-semibold">{product.ukuranLabel}</dd></div>
            <div><dt className="text-sm text-muted">Panjang × lebar</dt><dd className="mt-1 font-semibold">{formatUkuran(product.panjangCm, product.lebarCm)}</dd></div>
            <div><dt className="text-sm text-muted">Kondisi</dt><dd className="mt-1 font-semibold">{product.kondisi}/10</dd></div>
            <div><dt className="text-sm text-muted">Ketersediaan</dt><dd className="mt-1 font-semibold">{soldOut ? "Terjual" : "Tersedia, 1 barang"}</dd></div>
          </dl>
          <h2 className="mt-5 text-sm font-semibold">Catatan minus</h2>
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted">{product.catatanMinus.trim() || "Tidak ada catatan minus."}</p>
          <div className="mt-7">
            <AddToCart id={product.id} nama={product.nama} soldOut={soldOut} />
          </div>
        </div>
      </article>
    </main>
  );
}
