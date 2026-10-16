import { expect, test } from "@playwright/test";

test("the front file image starts below the playing preview", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-entry-phase="ready"]')).toBeVisible({ timeout: 15000 });
  const card = page.getByRole("button", { name: "Open Velova", exact: true });
  await expect(card.locator(".folder-file-insert img")).toBeVisible();
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    const fit = await card.evaluate((el) => {
      const insert = el.querySelector<HTMLElement>(".folder-file-insert")!;
      const previewHeight = el.clientWidth * 9 / 16;
      return { top: insert.offsetTop, bottom: insert.offsetTop + insert.offsetHeight, height: el.clientHeight, previewHeight };
    });
    expect(fit.top).toBeGreaterThanOrEqual(fit.previewHeight - 1);
    expect(Math.abs(fit.bottom - fit.height)).toBeLessThanOrEqual(1);
  }
  await expect.poll(() => card.locator("video").evaluate((video: HTMLVideoElement) => !video.paused && video.currentTime > 0)).toBe(true);
  await expect(page.locator(".folder-project-button")).toHaveCount(5);
});

test("the footer light plane covers the footer at both pointer extremes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-entry-phase="ready"]')).toBeVisible({ timeout: 15000 });
  const footer = page.locator(".site-footer");
  await footer.scrollIntoViewIfNeeded();
  const box = (await footer.boundingBox())!;
  for (const point of [{ x: 30, y: box.y + 30, direction: -1 }, { x: 1410, y: box.y + box.height - 30, direction: 1 }]) {
    await page.mouse.move(point.x, point.y);
    await expect.poll(() => page.locator(".footer-glow").evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41).then((x) => x * point.direction)).toBeGreaterThan(210);
    const covers = await footer.evaluate((el) => {
      const outer = el.getBoundingClientRect();
      const light = el.querySelector(".footer-glow")!.getBoundingClientRect();
      return light.left < outer.left && light.top < outer.top && light.right > outer.right && light.bottom > outer.bottom;
    });
    expect(covers).toBe(true);
  }
});
