# metscnd.id

Proyek Next.js App Router dengan TypeScript, Tailwind CSS, Prisma, dan PostgreSQL.

## Pengembangan lokal

Gunakan Node.js 24 LTS dan database PostgreSQL. Jalankan perintah dari direktori proyek.

```sh
npm ci
cp .env.example .env
```

Isi `DATABASE_URL` di `.env` dengan URL PostgreSQL. Setelah itu jalankan:

```sh
npm run db:generate
npm run db:setup
npm run dev
```

Aplikasi berjalan di http://localhost:3000. Atur `NEXT_PUBLIC_WHATSAPP_NUMBER` dengan nomor toko dalam format internasional (hanya angka). Jika kosong, checkout memakai nomor dummy `6281234567890`.

## Build dan Vercel

Atur salah satu variabel koneksi di Vercel untuk environment yang akan di-deploy. Aplikasi dan Prisma memakai URL PostgreSQL pertama yang tersedia dalam urutan `DATABASE_URL`, `STORAGE_DATABASE_URL`, lalu `POSTGRES_PRISMA_URL`.

`npm run build` membuat Prisma Client, menjalankan `prisma db push`, lalu mengisi enam produk contoh jika tabel `Product` kosong. Gunakan koneksi PostgreSQL yang mengizinkan pembaruan skema. Data yang sudah ada tetap dipertahankan, dan build berhenti jika perubahan skema memerlukan persetujuan atas kehilangan data. Database SQLite lama tidak dimigrasikan otomatis.

## Data produk

Setiap baris `Product` mewakili satu barang. Status awalnya `tersedia` dan dapat diubah menjadi `sold_out`. Simpan ukuran dalam sentimeter, harga dalam Rupiah bulat, dan kondisi sebagai bilangan bulat dari 1 hingga 10. Gunakan string kosong untuk produk tanpa catatan minus.

## Pemeriksaan

```sh
npm run lint
npm run build
```

## Dashboard admin

Buka `/admin` dan masuk dengan `ADMIN_PASSWORD` dari `.env`. Jika variabel belum diatur atau kosong, passwordnya `admin123`. Atur password sendiri sebelum membuka akses ke toko.

Foto bisa berupa URL gambar atau unggahan JPG, PNG, atau WebP hingga 4 MB. Foto unggahan dikompresi menjadi WebP dan disimpan sebagai Base64 Data URL di PostgreSQL.
