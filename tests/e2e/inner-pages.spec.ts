import { expect, test } from "@playwright/test";

test.setTimeout(90_000);

test("inner pages have useful copy and Perspective stays off the landing page", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of ["/about", "/contact", "/services", "/services/branding", "/services/pitch-deck", "/services/social-media", "/services/presentation-design", "/pricing"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-entry-phase="ready"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator("main")).not.toContainText(/TODO:|overview pending|Number to be added/);
  }
  await page.goto("/work", { waitUntil: "domcontentloaded" });
  await expect(page.locator('a[href="/work/perspective"]')).toBeVisible();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('main img[src*="perspective"], main a[href="/work/perspective"]')).toHaveCount(0);
});

test("services overview shares previews and child-service enquiry links", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/services", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-entry-phase="ready"]')).toBeVisible({ timeout: 15000 });
  await page.locator(".service-row").first().hover();
  await expect(page.locator(".service-hover-preview")).toHaveClass(/is-visible/);
  await expect(page.locator(".service-row").first()).toHaveCSS("background-color", "rgb(246, 59, 5)");
  await page.goto("/services/branding/logo-design", { waitUntil: "domcontentloaded" });
  await expect(page.locator("main h1")).toContainText(/logo/i);
  await expect(page.locator("main")).not.toContainText(/TODO:|coming soon/);
  await page.locator('main a[href*="items=branding:logo-design"]').first().click();
  await expect(page.getByRole("combobox", { name: "Service", exact: true })).toHaveText("Branding");
  await expect(page.locator("#contact-message")).toHaveValue(/Logo design/);
});

test("footer uses native cursor, a light transform and clear typography", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-entry-phase="ready"]')).toBeVisible({ timeout: 15000 });
  const footer = page.locator(".site-footer");
  await footer.scrollIntoViewIfNeeded();
  const box = (await footer.boundingBox())!;
  await page.mouse.move(200, box.y + 180);
  await expect(footer).toHaveCSS("cursor", "auto");
  expect(await footer.evaluate((el) => getComputedStyle(el, "::before").backdropFilter)).toBe("none");
  await expect(page.locator(".footer-column h2").first()).toHaveCSS("font-weight", "700");
  await expect(page.locator(".footer-wordmark-filled")).toHaveCSS("stroke", "rgb(255, 255, 255)");
  await page.mouse.move(1200, box.y + 180);
  await expect.poll(() => page.locator(".footer-glow").evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41), { timeout: 1000 }).toBeGreaterThan(190);
});
