"use client";

import Link from "next/link";
import type { Product } from "../../generated/prisma/client";
import type { cartProductSelect } from "../../lib/cart";
import { formatRupiah, formatUkuran } from "../../lib/format";
import { removeFromCart, useCartIds } from "../cart-store";

type CartProduct = Pick<Product, keyof typeof cartProductSelect>;

const field = "w-full rounded-md border border-line bg-white px-3 py-2.5 font-normal";

export function Cart({ products }: { products: CartProduct[] }) {
  const ids = useCartIds();
  if (ids === null) return <p role="status" className="text-muted">Memuat keranjang…</p>;

  const byId = new Map(products.map((product) => [product.id, product]));
  const available = ids.flatMap((id) => {
    const product = byId.get(id);
    return product?.status === "tersedia" ? [product] : [];
  });
  const total = available.reduce((sum, product) => sum + product.harga, 0);

  if (ids.length === 0) {
    return (
      <div className="rounded-lg border border-line p-7">
        <p className="text-muted">Keranjang Anda masih kosong.</p>
        <Link href="/#katalog" className="mt-3 inline-block font-semibold text-accent underline underline-offset-4">Lihat katalog</Link>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-7 lg:grid-cols-[1fr_25rem]">
      <section aria-labelledby="cart-items" className="rounded-lg border border-line px-4 sm:px-6">
        <h2 id="cart-items" className="border-b border-line py-4 font-display text-2xl">Barang pilihan</h2>
        <ul className="divide-y divide-line">
          {ids.map((id) => {
            const product = byId.get(id);
            const nama = product?.nama ?? "Produk dihapus";

            return (
              <li key={id} className="flex items-start justify-between gap-3 py-4">
                <div className="min-w-0">
                  <h3 className="font-semibold">
                    {product ? <Link href={`/produk/${id}`} className="hover:underline">{nama}</Link> : nama}
                  </h3>
                  {product && (
                    <p className="mt-1 text-sm text-muted">Ukuran {product.ukuranLabel} · {formatUkuran(product.panjangCm, product.lebarCm)}</p>
                  )}
                  {product?.status === "tersedia" ? (
                    <p className="mt-1 text-sm font-semibold text-accent">{formatRupiah(product.harga)}</p>
                  ) : (
                    <p className="mt-1 text-sm font-semibold text-[#a13532]">Tidak tersedia</p>
                  )}
                </div>
                <button type="button" onClick={() => removeFromCart(id)} aria-label={`Hapus ${nama}`} className="rounded-md border border-line px-3 py-1.5 text-sm font-semibold text-muted hover:bg-sand">Hapus</button>
              </li>
            );
          })}
        </ul>
        <p className="flex justify-between border-t border-line py-4 font-semibold">
          <span>Total harga</span><span className="text-accent">{formatRupiah(total)}</span>
        </p>
      </section>

      <form action="/keranjang/checkout" method="post" target="_blank" rel="noopener" className="grid gap-4 rounded-lg border border-line bg-white p-4 sm:p-6">
        <h2 className="font-display text-2xl">Data pembeli</h2>
        <input type="hidden" name="produk" value={JSON.stringify(available.map(({ id }) => id))} />
        <label className="grid gap-1.5 text-sm font-semibold">
          Nama Pembeli
          <input className={field} name="nama" autoComplete="name" required maxLength={100} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Nomor HP
          <input className={field} name="hp" type="tel" autoComplete="tel" required maxLength={32} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Alamat Pengiriman
          <textarea className={field} name="alamat" autoComplete="street-address" required maxLength={500} rows={3} />
        </label>
        <button type="submit" disabled={!available.length} className="rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-[#1c3d2e] disabled:cursor-not-allowed disabled:bg-sand disabled:text-muted">
          Checkout via WhatsApp
        </button>
        {available.length < ids.length && (
          <p className="text-sm text-muted">Hanya barang yang tersedia yang akan masuk ke pesanan.</p>
        )}
      </form>
    </div>
  );
}
