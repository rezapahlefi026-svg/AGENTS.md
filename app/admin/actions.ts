"use server";

import { unlink } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { KategoriProduk, StatusProduk, UkuranLabel } from "../../generated/prisma/enums";
import { endAdminSession, matchesAdminPassword, requireAdmin, startAdminSession } from "../../lib/admin-session";
import { prisma } from "../../lib/prisma";
import { saveProductPhoto } from "../../lib/product-upload";

function text(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function idFrom(form: FormData) {
  const value = text(form, "id");
  const id = Number(value);
  if (!/^[1-9]\d{0,9}$/.test(value) || id > 2147483647) redirect("/admin?info=data");
  return id;
}

function refreshStore(id?: number) {
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/keranjang");
  if (id) revalidatePath(`/produk/${id}`);
}

export async function login(form: FormData) {
  const password = form.get("password");
  if (typeof password !== "string" || !matchesAdminPassword(password)) redirect("/admin?info=password");

  await startAdminSession();
  redirect("/admin");
}

export async function logout() {
  await endAdminSession();
  redirect("/admin");
}

function validPhotoUrl(value: string) {
  if (/^\/(?:products|foto-unggahan)\/[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(value)) return true;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password;
  } catch {
    return false;
  }
}

function selected<T extends string>(options: Record<string, T>, value: string) {
  return Object.values(options).find((option) => option === value);
}

export async function saveProduct(form: FormData) {
  await requireAdmin();
  const id = form.has("id") ? idFrom(form) : undefined;
  const nama = text(form, "nama");
  const kategori = selected(KategoriProduk, text(form, "kategori"));
  const ukuranLabel = selected(UkuranLabel, text(form, "ukuranLabel"));
  const status = selected(StatusProduk, text(form, "status"));
  const panjangCm = Number(text(form, "panjangCm"));
  const lebarCm = Number(text(form, "lebarCm"));
  const kondisi = Number(text(form, "kondisi"));
  const hargaText = text(form, "harga");
  const harga = Number(hargaText);
  const catatanMinus = text(form, "catatanMinus");
  const url = text(form, "fotoUrl");
  const file = form.get("foto");
  const hasUpload = file instanceof File && file.size > 0;

  if (!nama || nama.length > 120 || !kategori || !ukuranLabel || !status ||
      ![panjangCm, lebarCm].every((value) => Number.isFinite(value) && value > 0) ||
      !Number.isInteger(kondisi) || kondisi < 1 || kondisi > 10 ||
      !/^\d+$/.test(hargaText) || harga > 2147483647 || catatanMinus.length > 1000) {
    redirect("/admin?info=data");
  }
  if (!hasUpload && (url.length > 2048 || !validPhotoUrl(url))) redirect("/admin?info=foto");

  const upload = hasUpload ? await saveProductPhoto(file) : null;
  if (hasUpload && !upload) redirect("/admin?info=foto");

  const data = { nama, kategori, ukuranLabel, panjangCm, lebarCm, kondisi, harga, catatanMinus, status, fotoUrl: upload?.url ?? url };

  let saved = true;
  try {
    if (id === undefined) {
      await prisma.product.create({ data });
    } else {
      const updated = await prisma.product.updateMany({ where: { id }, data });
      saved = Boolean(updated.count);
    }
  } catch (error) {
    if (upload) await unlink(upload.path).catch(() => {});
    throw error;
  }

  if (!saved) {
    if (upload) await unlink(upload.path);
    redirect("/admin?info=hilang");
  }

  refreshStore(id);
  redirect("/admin?info=simpan");
}

export async function setProductStatus(form: FormData) {
  await requireAdmin();
  const id = idFrom(form);
  const status = selected(StatusProduk, text(form, "status"));
  if (!status) redirect("/admin?info=data");

  const updated = await prisma.product.updateMany({ where: { id }, data: { status } });
  refreshStore(id);
  redirect(updated.count ? "/admin?info=status" : "/admin?info=hilang");
}

export async function deleteProduct(form: FormData) {
  await requireAdmin();
  const id = idFrom(form);
  const deleted = await prisma.product.deleteMany({ where: { id } });

  refreshStore(id);
  redirect(deleted.count ? "/admin?info=hapus" : "/admin?info=hilang");
}
