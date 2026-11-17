import type { Product } from "../../generated/prisma/client";
import { KategoriProduk, StatusProduk, UkuranLabel } from "../../generated/prisma/enums";
import { saveProduct } from "./actions";

const control = "w-full min-w-0 rounded-md border border-line bg-white px-3 py-2 font-normal";
const label = "grid min-w-0 gap-1 text-sm font-semibold";

export function ProductForm({ product }: { product?: Product }) {
  return (
    <form action={saveProduct} className="grid gap-4 sm:grid-cols-2">
      {product && <input type="hidden" name="id" value={product.id} />}
      <label className={`${label} sm:col-span-2`}>Nama barang
        <input className={control} name="nama" required maxLength={120} defaultValue={product?.nama} />
      </label>
      <label className={label}>Kategori
        <select className={control} name="kategori" defaultValue={product?.kategori}>
          {Object.values(KategoriProduk).map((kategori) => <option key={kategori}>{kategori}</option>)}
        </select>
      </label>
      <label className={label}>Ukuran label
        <select className={control} name="ukuranLabel" defaultValue={product?.ukuranLabel}>
          {Object.values(UkuranLabel).map((ukuran) => <option key={ukuran}>{ukuran}</option>)}
        </select>
      </label>
      <label className={label}>Panjang (cm)
        <input className={control} name="panjangCm" type="number" min="0" step="any" required defaultValue={product?.panjangCm} />
      </label>
      <label className={label}>Lebar (cm)
        <input className={control} name="lebarCm" type="number" min="0" step="any" required defaultValue={product?.lebarCm} />
      </label>
      <label className={label}>Kondisi (1–10)
        <input className={control} name="kondisi" type="number" min="1" max="10" required defaultValue={product?.kondisi} />
      </label>
      <label className={label}>Harga (Rp)
        <input className={control} name="harga" type="number" min="0" max="2147483647" required defaultValue={product?.harga} />
      </label>
      <label className={`${label} sm:col-span-2`}>Catatan minus
        <textarea className={control} name="catatanMinus" rows={2} maxLength={1000} defaultValue={product?.catatanMinus} />
      </label>
      <label className={label}>URL foto
        <input className={control} name="fotoUrl" inputMode="url" maxLength={2048} placeholder="https://" defaultValue={product?.fotoUrl} />
      </label>
      <label className={label}>Unggah foto lokal
        <input className={`${control} text-xs file:mr-2 file:font-semibold`} name="foto" type="file" accept="image/jpeg,image/png,image/webp" />
      </label>
      <p className="text-xs text-muted sm:col-span-2">Pilih URL atau file JPG, PNG, atau WebP hingga 5 MB. Jika keduanya diisi, file yang digunakan.</p>
      <label className={label}>Status
        <select className={control} name="status" defaultValue={product?.status ?? StatusProduk.tersedia}>
          <option value={StatusProduk.tersedia}>Tersedia</option>
          <option value={StatusProduk.sold_out}>Sold out</option>
        </select>
      </label>
      <button className="self-end rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1c3d2e]">
        {product ? "Simpan perubahan" : "Tambah produk"}
      </button>
    </form>
  );
}
