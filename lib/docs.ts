"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Hujjatlar — ma'ruza, xutba, dissertatsiya kabi matnlar.
 * Hammasi shu qurilmada (localStorage) saqlanadi, hech qayerga yuborilmaydi.
 */
export interface Doc {
  id: string;
  title: string;
  /** Markdown — iqtiboslar ham shu ko'rinishda saqlanadi */
  body: string;
  createdAt: number;
  updatedAt: number;
}

const KEY = "noor.docs.v1";
/** Ochiq turgan oxirgi hujjat — pleyerdan «hujjatga qo'shish» uchun */
const LAST_KEY = "noor.docs.last";

function read(): Doc[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as Doc[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function write(list: Doc[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, 200)));
  } catch {
    /* kvota to'lgan bo'lishi mumkin */
  }
  window.dispatchEvent(new Event("noor:docs"));
}

export function loadDocs(): Doc[] {
  return read().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getDoc(id: string): Doc | null {
  return read().find((d) => d.id === id) ?? null;
}

export function createDoc(title = ""): Doc {
  const now = Date.now();
  const doc: Doc = {
    id: `d${now}${Math.floor(performance.now()) % 1000}`,
    title,
    body: "",
    createdAt: now,
    updatedAt: now,
  };
  write([doc, ...read()]);
  setLastDoc(doc.id);
  return doc;
}

export function saveDoc(id: string, patch: Partial<Pick<Doc, "title" | "body">>): void {
  const list = read();
  const i = list.findIndex((d) => d.id === id);
  if (i < 0) return;
  list[i] = { ...list[i], ...patch, updatedAt: Date.now() };
  write(list);
}

export function removeDoc(id: string): void {
  write(read().filter((d) => d.id !== id));
}

export function duplicateDoc(id: string): Doc | null {
  const src = read().find((d) => d.id === id);
  if (!src) return null;
  const copy = createDoc(src.title);
  saveDoc(copy.id, { body: src.body });
  return getDoc(copy.id);
}

export function setLastDoc(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_KEY, id);
  } catch {
    /* ahamiyatsiz */
  }
}

export function getLastDoc(): Doc | null {
  if (typeof window === "undefined") return null;
  const id = window.localStorage.getItem(LAST_KEY);
  return id ? getDoc(id) : null;
}

/**
 * Matnni hujjat oxiriga qo'shadi. Hujjat ko'rsatilmasa — oxirgi ochilgani,
 * u ham bo'lmasa yangisi yaratiladi. Qaysi hujjatga tushgani qaytariladi.
 */
export function appendToDoc(text: string, docId?: string): Doc {
  let doc = docId ? getDoc(docId) : getLastDoc();
  if (!doc) doc = createDoc("");
  const body = doc.body.trim() ? `${doc.body.trimEnd()}\n\n${text}` : text;
  saveDoc(doc.id, { body });
  setLastDoc(doc.id);
  return getDoc(doc.id) as Doc;
}

/** Ro'yxat o'zgarishini kuzatuvchi hook */
export function useDocs(): Doc[] {
  const [docs, setDocs] = useState<Doc[]>([]);

  const refresh = useCallback(() => setDocs(loadDocs()), []);

  useEffect(() => {
    refresh();
    window.addEventListener("noor:docs", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("noor:docs", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return docs;
}

/** Sarlavha bo'sh bo'lsa — matnning birinchi qatoridan */
export function docTitle(doc: Doc, fallback: string): string {
  if (doc.title.trim()) return doc.title.trim();
  const first = doc.body
    .split("\n")
    .map((l) => l.replace(/^#+\s*/, "").trim())
    .find((l) => l.length > 0);
  return first ? first.slice(0, 60) : fallback;
}

export function wordCount(body: string): number {
  const words = body
    .replace(/[#>*_`\[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  return words.length;
}
