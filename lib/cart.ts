export function parseCartIds(value: string): number[] {
  try {
    const ids: unknown = JSON.parse(value);
    if (!Array.isArray(ids)) return [];

    return [...new Set(ids.filter((id): id is number =>
      typeof id === "number" && Number.isInteger(id) && id > 0 && id <= 2147483647,
    ))];
  } catch {
    return [];
  }
}

export const cartProductSelect = {
  id: true,
  nama: true,
  ukuranLabel: true,
  panjangCm: true,
  lebarCm: true,
  harga: true,
  status: true,
} as const;
