"use client";
import { useCallback, useMemo, useSyncExternalStore } from "react";

// مجموعة IDs محفوظة بالمتصفح (لايكات، محفوظات، متابعات) ومتزامنة بين كل المكونات والتابات.
// لما يجهز الـ API: خلي الحالة الأولية تيجي من السيرفر وهذا يضل للتحديث المتفائل.

const listeners = new Set();

function subscribe(callback) {
  listeners.add(callback);
  const onStorage = (e) => e.key?.startsWith("devflow:") && callback();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function emit() {
  listeners.forEach((fn) => fn());
}

export function useIdSet(key) {
  const raw = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(key) || "[]",
    () => "[]"
  );

  const ids = useMemo(() => {
    try {
      return new Set(JSON.parse(raw));
    } catch {
      return new Set();
    }
  }, [raw]);

  const toggle = useCallback(
    (id, force) => {
      const next = new Set(ids);
      const on = force ?? !next.has(id);
      if (on) next.add(id);
      else next.delete(id);
      localStorage.setItem(key, JSON.stringify([...next]));
      emit();
      return on;
    },
    [ids, key]
  );

  return [ids, toggle];
}

export const STORE_KEYS = {
  likes: "devflow:likes",
  bookmarks: "devflow:bookmarks",
  follows: "devflow:follows",
  commentLikes: "devflow:comment-likes",
};
