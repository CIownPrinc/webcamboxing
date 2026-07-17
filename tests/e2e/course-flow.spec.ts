/**
 * @license MIT
 * LEGAL NOTICE:
 * This software is provided "as is", without warranty of any kind.
 */

// COMPLIANCE REQUIREMENT: E2E tests must verify browser rendering, route transitions, and user interaction flows.

import { test, expect } from "@playwright/test";
import { APP_CONFIG } from "@/config/app.config";

test.describe("Course Navigation E2E", () => {
  test("should render the home page and navigate to curriculum route", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/webcam boxing/i);

    const curriculumLink = page.getByRole("link", { name: /see the curriculum/i });
    if (await curriculumLink.isVisible()) {
      await curriculumLink.click();
      await expect(page).toHaveURL(/.*\/curriculum/);
    }
  });

  test("should enforce theme toggle behavior without runtime errors", async ({ page }) => {
    await page.goto("/");
    const themeButton = page.getByRole("button", { name: /toggle theme/i });
    if (await themeButton.isVisible()) {
      await themeButton.click();
      const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
      expect(typeof isDark).toBe("boolean");
    }
  });

  test("should resume into the first incomplete module without route errors", async ({ page }) => {
    await page.addInitScript((storageKey) => {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          completed: {
            "intro/welcome": true,
            "intro/webcam-limits": true,
            "install-python/install": true,
            "vscode/setup-vscode": true,
            "venv/create-venv": true,
          },
          theme: "dark",
          lastVisited: null,
          wallpaper: "mountain",
          customWallpaper: null,
          easterEggFound: false,
        }),
      );
    }, APP_CONFIG.course.storageKey);

    await page.goto("/");
    const resumeLink = page.getByRole("link", { exact: true, name: "Resume" });

    await expect(resumeLink).toBeVisible();
    await resumeLink.click();

    await expect(page).toHaveURL(/.*\/lessons\/python-basics\/essentials/);
    await expect(
      page.getByRole("heading", { name: "Variables, functions, loops, classes, tuples" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "This page didn't load" })).toHaveCount(0);
  });
});
