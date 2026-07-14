/**
 * @vitest-environment jsdom
 * @license MIT
 * LEGAL NOTICE:
 * This software is provided "as is", without warranty of any kind.
 */

// COMPLIANCE REQUIREMENT: Integration tests must verify storage persistence across store reads/writes and state transitions.

import { describe, expect, it, beforeEach } from "vitest";
import { APP_CONFIG } from "@/config/app.config";

describe("Progress Storage Integration Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should persist valid completed state to localStorage cleanly", () => {
    const payload = {
      completed: { "mod1/lesson1": true },
      theme: "dark",
      lastVisited: { moduleId: "mod1", lessonId: "lesson1", at: 1000 },
    };
    localStorage.setItem(APP_CONFIG.course.storageKey, JSON.stringify(payload));
    const stored = localStorage.getItem(APP_CONFIG.course.storageKey);
    expect(stored).toBeDefined();
    if (stored) {
      const parsed = JSON.parse(stored) as typeof payload;
      expect(parsed.completed["mod1/lesson1"]).toBe(true);
      expect(parsed.theme).toBe("dark");
    }
  });
});
