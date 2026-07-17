/**
 * @vitest-environment jsdom
 * @license MIT
 * LEGAL NOTICE:
 * This software is provided "as is", without warranty of any kind.
 */

// COMPLIANCE REQUIREMENT: Course data must be importable and route-addressable during server-side rendering.

import { describe, expect, it } from "vitest";
import { allLessons, findLesson, modules, totalLessons } from "@/data/course";

describe("Course Data Unit Tests", () => {
  it("should import every module and lesson without server-side evaluation errors", () => {
    expect(modules.length).toBeGreaterThan(0);
    expect(allLessons.length).toBe(totalLessons);
  });

  it("should resolve every lesson by its route parameters", () => {
    for (const { module, lesson } of allLessons) {
      const found = findLesson(module.id, lesson.id);

      expect(found?.module.id).toBe(module.id);
      expect(found?.lesson.id).toBe(lesson.id);
    }
  });
});
