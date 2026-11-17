"use client";

import Link from "next/link";
import { addToCart, useCartIds } from "./cart-store";

export function CartLink() {
  const ids = useCartIds();

  return (
    <Link href="/keranjang" className="rounded-md border border-line px-3 py-2 text-sm font-semibold text-accent hover:bg-sand">
      Keranjang ({ids?.length ?? 0})
    </Link>
  );
}

export function AddToCart({ id, nama, soldOut }: { id: number; nama: string; soldOut: boolean }) {
  const ids = useCartIds();
  const className = "grid min-h-10 w-full place-items-center rounded-md border px-2 text-center text-sm font-semibold";

  if (soldOut) {
    return <button type="button" disabled className={`${className} cursor-not-allowed border-line bg-sand text-muted`}>Beli</button>;
  }

  if (ids?.includes(id)) {
    return <Link href="/keranjang" aria-label={`${nama} di keranjang`} className={`${className} border-line bg-sand text-accent`}>Di keranjang</Link>;
  }

  return (
    <button type="button" disabled={ids === null} onClick={() => addToCart(id)} aria-label={`Tambah ${nama} ke keranjang`} className={`${className} border-accent text-accent transition-colors enabled:hover:bg-accent enabled:hover:text-white disabled:opacity-60`}>
      Tambah ke keranjang
    </button>
  );
}
