import { expect, test } from "@playwright/test";

test.setTimeout(90_000);

test("loader message and animated counter keep separate space at short viewport heights", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 720 });
  await page.clock.install();
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.clock.runFor(1000);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".site-loader")).toBeVisible();
  for (const viewport of [{ width: 1920, height: 720 }, { width: 1440, height: 640 }, { width: 390, height: 568 }, { width: 844, height: 390 }, { width: 320, height: 480 }]) {
    await page.setViewportSize(viewport);
    await page.locator(".site-loader").evaluate((el) => (el as HTMLElement).style.setProperty("--loader-progress", "100"));
    const spacing = await page.evaluate(() => {
      const note = document.querySelector(".site-loader-note")!.getBoundingClientRect();
      const message = document.querySelector(".site-loader-message")!.getBoundingClientRect();
      const signature = document.querySelector(".site-loader-signature")!.getBoundingClientRect();
      const counter = document.querySelector(".site-loader-counter")!.getBoundingClientRect();
      return { gap: counter.top - note.bottom, headerGap: message.top - signature.bottom, fits: counter.left >= 0 && counter.right <= innerWidth && counter.bottom <= innerHeight - 16 };
    });
    expect(spacing.gap, JSON.stringify(viewport)).toBeGreaterThanOrEqual(24);
    expect(spacing.headerGap, JSON.stringify(viewport)).toBeGreaterThanOrEqual(12);
    expect(spacing.fits, JSON.stringify(viewport)).toBe(true);
  }
});

test("back-to-top aligns to the footer edge and clears the floating contact button", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-entry-phase="ready"]')).toBeVisible({ timeout: 15000 });
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    const boxes = await page.evaluate(() => ({ row: document.querySelector(".footer-bottom")!.getBoundingClientRect().toJSON(), top: document.querySelector(".back-to-top")!.getBoundingClientRect().toJSON(), widget: document.querySelector(".whatsapp-widget")!.getBoundingClientRect().toJSON() }));
    expect(Math.abs(boxes.top.right - boxes.row.right)).toBeLessThanOrEqual(1);
    expect(boxes.top.bottom).toBeLessThan(boxes.widget.top - 12);
  }
  await page.getByRole("button", { name: /Back to top/ }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(1);
});

test("scroll cue uses one clear arrow with smooth blue-orange-blue motion", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-entry-phase="ready"]')).toBeVisible({ timeout: 15000 });
  const cue = page.getByRole("link", { name: "Scroll to introduction" });
  await expect(cue.locator(".scroll-cue-mark")).toHaveCount(0);
  const arrow = cue.locator(".scroll-cue-arrow svg");
  await expect(arrow).toBeVisible();
  const colours = await arrow.evaluate((el) => {
    const animation = el.getAnimations().find((entry) => (entry as CSSAnimation).animationName === "scroll-cue-arrow-flow")!;
    animation.pause();
    return [0, 2400, 4800].map((time) => { animation.currentTime = time; return getComputedStyle(el).color; });
  });
  expect(colours).toEqual(["rgb(43, 79, 156)", "rgb(246, 59, 5)", "rgb(43, 79, 156)"]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(arrow).toHaveCSS("animation-name", "none");
  await page.setViewportSize({ width: 390, height: 844 });
  await cue.scrollIntoViewIfNeeded();
  await cue.click({ timeout: 3000 });
  await expect(page).toHaveURL(/#home-intro$/);
});
