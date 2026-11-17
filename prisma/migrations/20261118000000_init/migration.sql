CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama" TEXT NOT NULL,
    "kategori" TEXT NOT NULL CHECK ("kategori" IN ('Jaket', 'Kaos', 'Celana', 'Aksesoris')),
    "ukuranLabel" TEXT NOT NULL CHECK ("ukuranLabel" IN ('S', 'M', 'L', 'XL')),
    "panjangCm" REAL NOT NULL,
    "lebarCm" REAL NOT NULL,
    "kondisi" INTEGER NOT NULL CHECK (typeof("kondisi") = 'integer' AND "kondisi" BETWEEN 1 AND 10),
    "catatanMinus" TEXT NOT NULL DEFAULT '',
    "harga" INTEGER NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'tersedia' CHECK ("status" IN ('tersedia', 'sold_out'))
);
