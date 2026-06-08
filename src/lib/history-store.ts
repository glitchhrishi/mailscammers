import { useEffect, useState } from "react";

import type { AnalysisResult } from "./analyzer.functions";

export interface HistoryEmail {
  id: string;
  sender: string;
  senderName: string;
  subject: string;
  body: string;
  date: string;
  result: AnalysisResult;
}

const KEY = "legitmail.history.v1";

function read(): HistoryEmail[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEmail[];
  } catch {
    return [];
  }
}

function write(items: HistoryEmail[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("legitmail:history"));
}

export function addToHistory(entry: Omit<HistoryEmail, "id" | "date"> & { date?: string }) {
  const items = read();
  const next: HistoryEmail = {
    ...entry,
    id: crypto.randomUUID(),
    date: entry.date ?? new Date().toISOString(),
  };
  write([next, ...items]);
  return next;
}

export function removeFromHistory(id: string) {
  write(read().filter((i) => i.id !== id));
}

export function clearHistory() {
  write([]);
}

export function useHistory(): HistoryEmail[] {
  const [items, setItems] = useState<HistoryEmail[]>([]);
  useEffect(() => {
    setItems(read());
    const handler = () => setItems(read());
    window.addEventListener("legitmail:history", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("legitmail:history", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return items;
}
