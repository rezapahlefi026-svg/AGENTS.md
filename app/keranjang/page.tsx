import type { Metadata } from "next";
import Link from "next/link";
import { cartProductSelect } from "../../lib/cart";
import { prisma } from "../../lib/prisma";
import { Cart } from "./cart";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Keranjang" };

export default async function CartPage() {
  const products = await prisma.product.findMany({ select: cartProductSelect });

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-7 sm:px-8 sm:pt-10">
      <Link href="/#katalog" className="text-sm font-semibold text-accent hover:underline hover:underline-offset-4">
        <span aria-hidden="true">← </span>Kembali ke katalog
      </Link>
      <h1 className="mb-6 mt-4 font-display text-4xl tracking-tight sm:text-5xl">Keranjang belanja</h1>
      <Cart products={products} />
    </main>
  );
}
