"use client";

import Link from "next/link";
import { useState } from "react";
import { KategoriProduk, UkuranLabel } from "../generated/prisma/enums";
import type { Product } from "../generated/prisma/client";
import { formatRupiah } from "../lib/format";
import { AddToCart } from "./cart-controls";
import { ProductPhoto } from "./product-photo";

type CatalogProduct = Pick<Product, "id" | "nama" | "kategori" | "ukuranLabel" | "harga" | "fotoUrl" | "status">;

export function ProductCatalog({ products }: { products: CatalogProduct[] }) {
  const [kategori, setKategori] = useState("");
  const [ukuran, setUkuran] = useState("");
  const visible = products.filter((product) =>
    (!kategori || product.kategori === kategori) && (!ukuran || product.ukuranLabel === ukuran),
  );

  function resetFilters() {
    setKategori("");
    setUkuran("");
  }

  return (
    <section id="katalog" aria-labelledby="judul-katalog" className="scroll-mt-6 pb-20 pt-12 sm:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-5">
        <div>
          <h2 id="judul-katalog" className="font-display text-4xl sm:text-5xl">Katalog produk</h2>
          <p role="status" className="mt-2 text-sm text-muted">{visible.length} produk</p>
        </div>
        <div className="flex w-full gap-3 sm:w-auto">
          <label className="grid flex-1 gap-1.5 text-xs font-semibold sm:flex-none">
            Kategori
            <select value={kategori} onChange={(event) => setKategori(event.target.value)} className="min-h-11 min-w-0 rounded-md border border-line bg-white px-3 text-sm font-normal sm:w-44">
              <option value="">Semua kategori</option>
              {Object.values(KategoriProduk).map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label className="grid flex-1 gap-1.5 text-xs font-semibold sm:flex-none">
            Ukuran
            <select value={ukuran} onChange={(event) => setUkuran(event.target.value)} className="min-h-11 min-w-0 rounded-md border border-line bg-white px-3 text-sm font-normal sm:w-40">
              <option value="">Semua ukuran</option>
              {Object.values(UkuranLabel).map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="py-14 text-center">
          <p className="text-muted">{products.length === 0 ? "Katalog belum berisi produk." : "Tidak ada produk dengan filter tersebut."}</p>
          {(kategori || ukuran) && (
            <button type="button" onClick={resetFilters} className="mt-4 font-semibold text-accent underline underline-offset-4">Hapus filter</button>
          )}
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((product) => {
            const href = `/produk/${product.id}`;
            const soldOut = product.status === "sold_out";

            return (
              <li key={product.id} className="flex min-w-0 flex-col">
                <Link href={href} aria-label={`Detail ${product.nama}`} className="group relative block aspect-square overflow-hidden rounded-md bg-sand">
                  <ProductPhoto nama={product.nama} fotoUrl={product.fotoUrl} soldOut={soldOut} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" />
                </Link>
                <p className="mt-3 text-xs font-medium text-muted">{product.kategori} · {product.ukuranLabel}</p>
                <h3 className="mb-1 text-sm font-semibold sm:text-base"><Link href={href} className="hover:underline">{product.nama}</Link></h3>
                <p className="mb-3 mt-auto text-sm font-semibold text-accent">{formatRupiah(product.harga)}</p>
                <AddToCart id={product.id} nama={product.nama} soldOut={soldOut} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
