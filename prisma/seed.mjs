import "dotenv/config";
import { DatabaseSync } from "node:sqlite";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
if (!url.startsWith("file:")) throw new Error("DATABASE_URL harus berupa URL file SQLite.");

const path = url.startsWith("file://") ? new URL(url) : pathToFileURL(resolve(url.slice(5)));
const db = new DatabaseSync(path);

const products = [
  ["Jaket Denim Vintage", "Jaket", "L", 66, 56, 9, "Pudar ringan di lipatan siku.", 185000, "denim", "tersedia"],
  ["Kaos Krem Cotton", "Kaos", "M", 68, 51, 8, "Noda samar di dekat kelim bawah.", 85000, "kaos-krem", "tersedia"],
  ["Celana Cargo Olive", "Celana", "L", 99, 43, 8, "Ada bekas lipatan ringan di lutut.", 145000, "cargo", "sold_out"],
  ["Topi Canvas Hitam", "Aksesoris", "M", 27, 18, 9, "", 65000, "topi", "tersedia"],
  ["Jaket Corduroy Cokelat", "Jaket", "XL", 70, 61, 8, "Bagian ujung manset agak pudar.", 195000, "corduroy", "tersedia"],
  ["Kaos Marun Vintage", "Kaos", "S", 60, 46, 7, "Ada satu lubang kecil dekat jahitan samping.", 70000, "kaos-marun", "sold_out"],
];

try {
  const existing = db.prepare('SELECT 1 FROM "Product" WHERE "fotoUrl" = ?');
  const insert = db.prepare(`
    INSERT INTO "Product"
      ("nama", "kategori", "ukuranLabel", "panjangCm", "lebarCm", "kondisi", "catatanMinus", "harga", "fotoUrl", "status")
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.exec("BEGIN IMMEDIATE");
  for (const [nama, kategori, ukuranLabel, panjangCm, lebarCm, kondisi, catatanMinus, harga, photo, status] of products) {
    const fotoUrl = `/products/${photo}.webp`;
    if (!existing.get(fotoUrl)) {
      insert.run(nama, kategori, ukuranLabel, panjangCm, lebarCm, kondisi, catatanMinus, harga, fotoUrl, status);
    }
  }
  db.exec("COMMIT");
  console.log("Data contoh katalog siap.");
} finally {
  db.close();
}
