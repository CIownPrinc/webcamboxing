import { useEffect, useState, useSyncExternalStore } from "react";

const KEY = "wb.progress.v1";

type LastVisited = { moduleId: string; lessonId: string; at: number };
type State = {
  completed: Record<string, true>;
  theme: "light" | "dark";
  lastVisited: LastVisited | null;
};

function read(): State {
  if (typeof window === "undefined") return { completed: {}, theme: "dark", lastVisited: null };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { completed: {}, theme: "dark", lastVisited: null };
    return { completed: {}, theme: "dark", lastVisited: null, ...JSON.parse(raw) };
  } catch {
    return { completed: {}, theme: "dark", lastVisited: null };
  }
}

const listeners = new Set<() => void>();
let state: State | null = null;
function get(): State {
  if (state === null) state = read();
  return state;
}
function write(next: State) {
  state = next;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(next));
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function serverSnapshot(): State {
  return { completed: {}, theme: "dark", lastVisited: null };
}

export function useProgress() {
  const s = useSyncExternalStore(subscribe, get, serverSnapshot);
  return {
    completed: s.completed,
    theme: s.theme,
    lastVisited: s.lastVisited,
    isDone: (key: string) => Boolean(s.completed[key]),
    toggle: (key: string) => {
      const c = { ...s.completed };
      if (c[key]) delete c[key];
      else c[key] = true;
      write({ ...s, completed: c });
    },
    setTheme: (t: "light" | "dark") => write({ ...s, theme: t }),
    setLastVisited: (moduleId: string, lessonId: string) => {
      const prev = s.lastVisited;
      if (prev && prev.moduleId === moduleId && prev.lessonId === lessonId) return;
      write({ ...s, lastVisited: { moduleId, lessonId, at: Date.now() } });
    },
  };
}

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export function lessonKey(moduleId: string, lessonId: string) {
  return `${moduleId}/${lessonId}`;
}