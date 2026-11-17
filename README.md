# Toko Thrift

Proyek Next.js App Router dengan TypeScript, Tailwind CSS, dan Prisma untuk SQLite.

## Pengembangan lokal

Gunakan Node.js 24 LTS. Jalankan perintah dari direktori proyek.

```sh
npm ci
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

Aplikasi berjalan di http://localhost:3000. Secara bawaan SQLite menyimpan data di `prisma/dev.db`.
Ulangi `npm run db:seed` sesuai kebutuhan untuk memasukkan enam produk contoh tanpa menggandakan baris yang sudah ada. Atur `NEXT_PUBLIC_WHATSAPP_NUMBER` di `.env` dengan nomor toko dalam format internasional (hanya angka). Jika kosong, checkout memakai nomor dummy `6281234567890`.

## Data produk

Setiap baris `Product` mewakili satu barang. Status awalnya `tersedia` dan dapat diubah menjadi `sold_out`. Simpan ukuran dalam sentimeter, harga dalam Rupiah bulat, dan kondisi sebagai bilangan bulat dari 1 hingga 10. Gunakan string kosong untuk produk tanpa catatan minus.

## Pemeriksaan

```sh
npm run lint
npm run build
```

## Dashboard admin

Buka `/admin` dan masuk dengan `ADMIN_PASSWORD` dari `.env`. Jika variabel belum diatur atau kosong, passwordnya `admin123`. Atur password sendiri sebelum membuka akses ke toko.

Foto unggahan tersimpan di `public/uploads` sebagai WebP. Jalankan aplikasi dengan filesystem yang dapat ditulis dan simpan direktori ini bersama database SQLite saat memindahkan toko.
