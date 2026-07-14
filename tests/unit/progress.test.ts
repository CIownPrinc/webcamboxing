/**
 * @vitest-environment jsdom
 * @license MIT
 * LEGAL NOTICE:
 * This software is provided "as is", without warranty of any kind.
 */

// COMPLIANCE REQUIREMENT: Unit tests must verify Zod schema parsing and progress state functions before any business logic modification.

import { describe, expect, it, beforeEach } from "vitest";
import { lessonKey, lessonKeyFromParams, type LessonKeyParams } from "@/lib/progress";
import { APP_CONFIG } from "@/config/app.config";

describe("Progress Unit Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should format lesson key correctly from string arguments", () => {
    const key = lessonKey("mod1", "lesson1");
    expect(key).toBe("mod1/lesson1");
  });

  it("should format lesson key correctly from typed parameters interface", () => {
    const params: LessonKeyParams = { moduleId: "mod2", lessonId: "lesson2" };
    const key = lessonKeyFromParams(params);
    expect(key).toBe("mod2/lesson2");
  });

  it("should access default configuration parameters cleanly", () => {
    expect(APP_CONFIG.course.storageKey).toBe("wb.progress.v1");
    expect(APP_CONFIG.ui.defaultTheme).toBe("dark");
  });
});
