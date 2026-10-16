import { expect, test } from "@playwright/test";

test("footer light follows the mouse smoothly and settles on exit", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-entry-phase="ready"]')).toBeVisible({ timeout: 15_000 });
  const footer = page.locator(".site-footer");
  await footer.scrollIntoViewIfNeeded();
  const box = (await footer.boundingBox())!;
  const light = page.locator(".footer-glow");
  const translation = () => light.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
  await page.mouse.move(box.x + box.width * .18, Math.max(130, box.y + 170));
  await expect.poll(translation).toBeLessThan(-60);
  const left = await translation();
  await page.mouse.move(box.x + box.width * .82, Math.max(180, box.y + 250));
  await expect.poll(translation).toBeGreaterThan(60);
  expect((await translation()) - left).toBeGreaterThan(120);
  await page.mouse.move(5, 5);
  await expect.poll(async () => Math.abs(await translation())).toBeLessThan(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(footer).toHaveClass(/is-reduced-motion/);
  await page.mouse.move(box.x + box.width * .82, Math.max(180, box.y + 250));
  await expect.poll(async () => Math.abs(await translation())).toBeLessThan(1);
});

test("mobile menu contains the logo and close control without a Navigation label", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-entry-phase="ready"]')).toBeVisible({ timeout: 15_000 });
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  const menu = page.getByRole("dialog", { name: "Site menu" });
  await expect(menu.getByText("Navigation", { exact: true })).toHaveCount(0);
  await expect(menu.locator(".brand-logo-image")).toBeVisible();
  await expect(menu.getByRole("button", { name: "Close menu", exact: true })).toBeVisible();
});
