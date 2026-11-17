# Panduan Proyek Situs Toko Thrift Online

## Teknologi & Arsitektur
- Framework: Next.js (App Router) dengan TypeScript
- Styling: Tailwind CSS (desain mobile-first dan responsif)
- Penyimpanan Data: Gunakan database sederhana seperti SQLite (via Prisma) atau Supabase agar data produk tersimpan permanen.

## Fitur Wajib Toko Thrift
- **Stok Tunggal (1-of-1):** Setiap produk hanya memiliki 1 stok. Produk memiliki status `tersedia` atau `sold_out`.
- **Detail Spesifik Thrift:** Setiap produk wajib memiliki kolom: Nama Barang, Kategori (Jaket, Kaos, Celana, Aksesoris), Ukuran Label (S/M/L/XL), Ukuran Asli (Panjang x Lebar dalam cm), Kondisi (skala 1-10), Catatan Minus, Harga (Rupiah), dan Foto Produk.
- **WhatsApp Checkout:** Tidak menggunakan payment gateway. Keranjang belanja akan mengarahkan pembeli ke tautan `https://wa.me` dengan format pesan otomatis berisi daftar barang, total harga, nama pembeli, dan alamat pengiriman.
- **Halaman Admin (`/admin`):** Dilindungi sistem login sederhana menggunakan password dari file `.env` (`ADMIN_PASSWORD`). Admin bisa menambah produk, mengunggah foto, mengubah detail, dan mengubah status barang menjadi `sold_out`.

## Aturan Penulisan Kode
- Gunakan format mata uang Rupiah (contoh: Rp 150.000) untuk semua tampilan harga.
- Pastikan tombol WhatsApp checkout otomatis terbuka di tab baru.
- Selalu jalankan `npm run lint` dan `npm run build` sebelum menyelesaikan tugas untuk memastikan tidak ada error.
- 
