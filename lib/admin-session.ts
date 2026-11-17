import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const cookieName = "thrift-admin";
const sessionSeconds = 8 * 60 * 60;

function password() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function sign(value: string) {
  return createHmac("sha256", password()).update("thrift-admin:" + value).digest();
}

export function matchesAdminPassword(value: string) {
  return timingSafeEqual(digest(value), digest(password()));
}

export async function isAdmin() {
  const value = (await cookies()).get(cookieName)?.value ?? "";
  const match = /^(\d{1,12})\.([a-f0-9]{32})\.([a-f0-9]{64})$/.exec(value);
  if (!match || Number(match[1]) <= Math.floor(Date.now() / 1000)) return false;

  return timingSafeEqual(sign(`${match[1]}.${match[2]}`), Buffer.from(match[3], "hex"));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin");
}

export async function startAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + sessionSeconds;
  const payload = `${expires}.${randomBytes(16).toString("hex")}`;
  const requestHeaders = await headers();
  const secure = requestHeaders.get("origin")?.startsWith("https://") ||
    requestHeaders.get("x-forwarded-proto")?.split(",")[0].trim() === "https";

  (await cookies()).set(cookieName, `${payload}.${sign(payload).toString("hex")}`, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    maxAge: sessionSeconds,
    path: "/admin",
  });
}

export async function endAdminSession() {
  (await cookies()).set(cookieName, "", { path: "/admin", maxAge: 0, httpOnly: true, sameSite: "lax" });
}
