"use client";

import { useMemo, useSyncExternalStore } from "react";
import { parseCartIds } from "../lib/cart";

const key = "toko-thrift.cart";
const empty = "[]";
const listeners = new Set<() => void>();
let fallback: string | undefined;

function snapshot() {
  if (fallback !== undefined) return fallback;
  try {
    return localStorage.getItem(key) ?? empty;
  } catch {
    return empty;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  function onStorage(event: StorageEvent) {
    if (event.key === key || event.key === null) listener();
  }

  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function save(ids: number[]) {
  const value = JSON.stringify(ids);
  try {
    localStorage.setItem(key, value);
    fallback = undefined;
  } catch {
    fallback = value;
  }
  listeners.forEach((listener) => listener());
}

export function addToCart(id: number) {
  const ids = parseCartIds(snapshot());
  if (!ids.includes(id)) save([...ids, id]);
}

export function removeFromCart(id: number) {
  save(parseCartIds(snapshot()).filter((item) => item !== id));
}

export function useCartIds() {
  const value = useSyncExternalStore(subscribe, snapshot, () => null);
  return useMemo(() => value === null ? null : parseCartIds(value), [value]);
}
