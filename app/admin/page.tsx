import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "../../lib/admin-session";
import { formatRupiah } from "../../lib/format";
import { prisma } from "../../lib/prisma";
import { ProductPhoto } from "../product-photo";
import { deleteProduct, login, logout, setProductStatus } from "./actions";
import { ProductForm } from "./product-form";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const messages = {
  data: "Periksa kembali detail produk.",
  foto: "Masukkan URL foto yang valid atau unggah file JPG, PNG, atau WebP hingga 5 MB.",
  hilang: "Produk sudah tidak ada.",
  simpan: "Produk berhasil disimpan.",
  status: "Status produk berhasil diperbarui.",
  hapus: "Produk berhasil dihapus.",
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ info?: string }> }) {
  const { info } = await searchParams;
  if (!(await isAdmin())) {
    return (
      <main className="mx-auto max-w-md px-5 py-12 sm:py-20">
        <h1 className="mb-5 font-display text-4xl text-accent">Masuk admin</h1>
        <form action={login} className="grid gap-4 rounded-lg border border-line bg-white p-5">
          {info === "password" && <p role="alert" className="text-sm font-semibold text-[#a13532]">Password salah.</p>}
          <label className="grid gap-1.5 text-sm font-semibold">Password
            <input type="password" name="password" autoComplete="current-password" required className="rounded-md border border-line px-3 py-2 font-normal" />
          </label>
          <button className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1c3d2e]">Masuk</button>
        </form>
      </main>
    );
  }

  const products = await prisma.product.findMany({ orderBy: { id: "desc" } });
  const message = Object.entries(messages).find(([key]) => key === info)?.[1];

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Dashboard admin</h1>
        <form action={logout}>
          <button className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-accent hover:bg-sand">Keluar</button>
        </form>
      </div>
      {message && <p role="status" className="mb-5 rounded-md border border-line bg-sand p-3 text-sm">{message}</p>}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)]">
        <section aria-labelledby="new-product" className="rounded-lg border border-line bg-white p-4 sm:p-5">
          <h2 id="new-product" className="mb-4 font-display text-2xl">Tambah produk</h2>
          <ProductForm />
        </section>
        <section aria-labelledby="product-list" className="min-w-0 rounded-lg border border-line bg-white p-4 sm:p-5">
          <h2 id="product-list" className="mb-2 font-display text-2xl">Daftar produk ({products.length})</h2>
          {!products.length && <p className="mt-4 text-sm text-muted">Belum ada produk.</p>}
          <ul className="divide-y divide-line">
            {products.map((product) => {
              const soldOut = product.status === "sold_out";
              return (
                <li key={product.id} className="space-y-3 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-sand">
                        <ProductPhoto nama={product.nama} fotoUrl={product.fotoUrl} sizes="56px" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="break-words font-semibold"><Link href={`/produk/${product.id}`} className="hover:underline">{product.nama}</Link></h3>
                        <p className="text-sm text-muted">{product.kategori} · {product.ukuranLabel} · {formatRupiah(product.harga)}</p>
                        <p className={`text-xs font-semibold ${soldOut ? "text-[#a13532]" : "text-accent"}`}>{soldOut ? "Sold out" : "Tersedia"}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <form action={setProductStatus}>
                        <input type="hidden" name="id" value={product.id} />
                        <input type="hidden" name="status" value={soldOut ? "tersedia" : "sold_out"} />
                        <button className="rounded border border-line px-2.5 py-1.5 text-xs font-semibold text-accent hover:bg-sand">
                          {soldOut ? "Tandai tersedia" : "Tandai sold out"}
                        </button>
                      </form>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <button aria-label={`Hapus ${product.nama}`} className="rounded border border-line px-2.5 py-1.5 text-xs font-semibold text-[#a13532] hover:bg-sand">Hapus</button>
                      </form>
                    </div>
                  </div>
                  <details className="rounded-md border border-line px-3 py-2">
                    <summary className="cursor-pointer text-sm font-semibold text-accent">Ubah detail</summary>
                    <div className="mt-3"><ProductForm product={product} /></div>
                  </details>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
