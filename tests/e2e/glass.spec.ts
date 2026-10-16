import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("glass surfaces preserve readable navigation, the hero grid and folder reflection", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".site-header .header-whatsapp")).toHaveCount(0);
  await expect(page.locator(".site-header-inner")).toHaveCSS("border-radius", "999px");
  expect(await page.locator(".site-header-inner").evaluate((node) => getComputedStyle(node).backdropFilter)).toContain("blur");
  expect(await page.locator(".home-hero-grid").evaluate((node) => getComputedStyle(node).backgroundImage)).toContain("linear-gradient");
  expect(await page.locator(".project-folder-assembly").evaluate((node) => getComputedStyle(node).getPropertyValue("-webkit-box-reflect"))).toContain("below");
  await page.screenshot({ path: test.info().outputPath("glass-hero-desktop.png") });

  await page.locator(".home-intro").scrollIntoViewIfNeeded();
  await expect(page.locator(".site-header")).toHaveClass(/is-scrolled/);
  await page.screenshot({ path: test.info().outputPath("glass-intro-desktop.png") });
  const contrast = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
  expect(contrast.violations.map((item) => item.nodes.map((node) => node.target))).toEqual([]);

  await page.locator(".home-testimonials").evaluate((node) => window.scrollTo(0, node.getBoundingClientRect().top + window.scrollY + 30));
  await expect(page.locator(".site-header")).toHaveClass(/is-over-dark/);
  await expect(page.locator(".site-header .desktop-nav-link").first()).toHaveCSS("color", "rgb(200, 209, 217)");
  await page.screenshot({ path: test.info().outputPath("glass-header-dark.png") });

  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    const header = await page.locator(".site-header").boundingBox();
    expect(header!.x).toBeGreaterThanOrEqual(10);
    expect(header!.x + header!.width).toBeLessThanOrEqual(width - 10);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: test.info().outputPath("glass-hero-mobile.png") });
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await page.locator("#mobile-menu").getByRole("button", { name: "Close menu", exact: true }).click();
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
});
