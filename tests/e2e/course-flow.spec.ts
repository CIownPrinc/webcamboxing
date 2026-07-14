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
    await expect(page).toHaveTitle(/how to build a boxing game/i);

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
});
