const angka = new Intl.NumberFormat("id-ID");

export function formatRupiah(harga: number) {
  return `Rp ${angka.format(harga)}`;
}

export function formatUkuran(panjang: number, lebar: number) {
  return `${angka.format(panjang)} × ${angka.format(lebar)} cm`;
}
