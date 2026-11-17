import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { CartLink } from "./cart-controls";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Toko Thrift", template: "%s | Toko Thrift" },
  description: "Katalog pakaian dan aksesori preloved.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id">
      <body className="antialiased">
        <header className="border-b border-line">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
            <Link href="/" className="font-display text-2xl font-bold tracking-tight">Toko Thrift<span className="text-accent">.</span></Link>
            <nav aria-label="Navigasi utama" className="flex items-center gap-3 sm:gap-5">
              <Link href="/#katalog" className="text-sm font-semibold text-accent hover:underline hover:underline-offset-4">Katalog</Link>
              <CartLink />
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-7xl justify-end px-5 py-5 sm:px-8">
            <Link href="/admin" className="text-xs text-muted hover:text-accent hover:underline">Admin</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
