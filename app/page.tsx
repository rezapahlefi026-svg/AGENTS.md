import Image from "next/image";
import { prisma } from "../lib/prisma";
import { ProductCatalog } from "./product-catalog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { id: "asc" },
    select: { id: true, nama: true, kategori: true, ukuranLabel: true, harga: true, fotoUrl: true, status: true },
  });

  return (
    <main className="mx-auto max-w-7xl px-5 sm:px-8">
      <section className="mt-5 grid overflow-hidden rounded-lg bg-[#e9e5d9] sm:mt-8 sm:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col items-start justify-center px-6 py-10 sm:px-10 lg:px-16 lg:py-16">
          <h1 className="max-w-xl font-display text-5xl leading-[0.99] tracking-tight text-accent sm:text-6xl lg:text-7xl">Pakaian preloved pilihan</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted sm:text-base">Setiap barang hanya tersedia satu stok.</p>
          <a href="#katalog" className="mt-7 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-[#1c3d2e]">
            Lihat katalog <span aria-hidden="true" className="ml-1">↓</span>
          </a>
        </div>
        <div className="relative min-h-56 bg-sand sm:min-h-80">
          <Image src="/products/denim.webp" alt="Jaket denim biru vintage" fill sizes="(min-width: 640px) 50vw, 100vw" preload className="object-cover object-center" />
        </div>
      </section>
      <ProductCatalog products={products} />
    </main>
  );
}
