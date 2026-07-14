/**
 * @license MIT
 * LEGAL NOTICE:
 * This software is provided "as is", without warranty of any kind, express or
 * implied.
 */

import { useEffect, useState, useSyncExternalStore } from "react";
import { z } from "zod";
import { APP_CONFIG } from "@/config/app.config";

// COMPLIANCE REQUIREMENT: User progress state must conform strictly to expected data types when reading from client storage.

const LastVisitedSchema = z.object({
  moduleId: z.string(),
  lessonId: z.string(),
  at: z.number().int().nonnegative(),
});

const ProgressStateSchema = z.object({
  completed: z.record(z.string(), z.literal(true)).default({}),
  theme: z.enum(["light", "dark"]).default(APP_CONFIG.ui.defaultTheme),
  lastVisited: LastVisitedSchema.nullable().default(null),
});

export type LastVisited = z.infer<typeof LastVisitedSchema>;
export type State = z.infer<typeof ProgressStateSchema>;

export interface ProgressServiceResult {
  readonly completed: Record<string, true>;
  readonly theme: "light" | "dark";
  readonly lastVisited: LastVisited | null;
  readonly isDone: (key: string) => boolean;
  readonly toggle: (key: string) => void;
  readonly setTheme: (newTheme: "light" | "dark") => void;
  readonly setLastVisited: (moduleId: string, lessonId: string) => void;
}

export interface LessonKeyParams {
  readonly moduleId: string;
  readonly lessonId: string;
}

const DEFAULT_STATE: State = {
  completed: {},
  theme: APP_CONFIG.ui.defaultTheme,
  lastVisited: null,
};

function read(): State {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }
  try {
    const raw = localStorage.getItem(APP_CONFIG.course.storageKey);
    if (!raw) {
      return DEFAULT_STATE;
    }
    const parsed = JSON.parse(raw) as unknown;
    const validated = ProgressStateSchema.safeParse(parsed);
    if (!validated.success) {
      return DEFAULT_STATE;
    }
    return validated.data;
  } catch {
    return DEFAULT_STATE;
  }
}

const listeners = new Set<() => void>();
let state: State | null = null;

function get(): State {
  if (state === null) {
    state = read();
  }
  return state;
}

function write(next: State): void {
  state = next;
  if (typeof window !== "undefined") {
    localStorage.setItem(APP_CONFIG.course.storageKey, JSON.stringify(next));
  }
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function serverSnapshot(): State {
  return DEFAULT_STATE;
}

export function useProgress(): ProgressServiceResult {
  const currentStore = useSyncExternalStore(subscribe, get, serverSnapshot);
  return {
    completed: currentStore.completed,
    theme: currentStore.theme,
    lastVisited: currentStore.lastVisited,
    isDone: (key: string): boolean => Boolean(currentStore.completed[key]),
    toggle: (key: string): void => {
      const updatedCompleted = { ...currentStore.completed };
      if (updatedCompleted[key]) {
        delete updatedCompleted[key];
      } else {
        updatedCompleted[key] = true;
      }
      write({ ...currentStore, completed: updatedCompleted });
    },
    setTheme: (newTheme: "light" | "dark"): void => {
      write({ ...currentStore, theme: newTheme });
    },
    setLastVisited: (moduleId: string, lessonId: string): void => {
      const prev = currentStore.lastVisited;
      if (prev && prev.moduleId === moduleId && prev.lessonId === lessonId) {
        return;
      }
      write({
        ...currentStore,
        lastVisited: { moduleId, lessonId, at: Date.now() },
      });
    },
  };
}

export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState<boolean>(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}

export function lessonKey(moduleId: string, lessonId: string): string {
  return `${moduleId}/${lessonId}`;
}
export function lessonKeyFromParams(params: LessonKeyParams): string {
  return `${params.moduleId}/${params.lessonId}`;
}
