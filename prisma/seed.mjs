import "dotenv/config";
import pg from "pg";
import { databaseSchema, requireDatabaseUrl } from "../lib/database-url.mjs";

const connectionString = requireDatabaseUrl();
const schema = databaseSchema(connectionString).replaceAll('"', '""');
const table = `"${schema}"."Product"`;
const client = new pg.Client({ connectionString });

const products = [
  ["Jaket Denim Vintage", "Jaket", "L", 66, 56, 9, "Pudar ringan di lipatan siku.", 185000, "denim", "tersedia"],
  ["Kaos Krem Cotton", "Kaos", "M", 68, 51, 8, "Noda samar di dekat kelim bawah.", 85000, "kaos-krem", "tersedia"],
  ["Celana Cargo Olive", "Celana", "L", 99, 43, 8, "Ada bekas lipatan ringan di lutut.", 145000, "cargo", "sold_out"],
  ["Topi Canvas Hitam", "Aksesoris", "M", 27, 18, 9, "", 65000, "topi", "tersedia"],
  ["Jaket Corduroy Cokelat", "Jaket", "XL", 70, 61, 8, "Bagian ujung manset agak pudar.", 195000, "corduroy", "tersedia"],
  ["Kaos Marun Vintage", "Kaos", "S", 60, 46, 7, "Ada satu lubang kecil dekat jahitan samping.", 70000, "kaos-marun", "sold_out"],
];

await client.connect();
try {
  await client.query("BEGIN");
  // Serialize the empty-table check across simultaneous builds.
  await client.query(`LOCK TABLE ${table} IN SHARE ROW EXCLUSIVE MODE`);
  const { rowCount } = await client.query(`SELECT 1 FROM ${table} LIMIT 1`);

  if (rowCount === 0) {
    for (const [nama, kategori, ukuranLabel, panjangCm, lebarCm, kondisi, catatanMinus, harga, photo, status] of products) {
      await client.query(
        `INSERT INTO ${table}
          ("nama", "kategori", "ukuranLabel", "panjangCm", "lebarCm", "kondisi", "catatanMinus", "harga", "fotoUrl", "status")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [nama, kategori, ukuranLabel, panjangCm, lebarCm, kondisi, catatanMinus, harga, `/products/${photo}.webp`, status],
      );
    }
  }

  await client.query("COMMIT");
  console.log(rowCount === 0 ? "Data contoh katalog siap." : "Katalog sudah berisi produk.");
} catch (error) {
  await client.query("ROLLBACK").catch(() => {});
  throw error;
} finally {
  await client.end();
}
