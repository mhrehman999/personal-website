import { expect, test } from "@playwright/test";

test.setTimeout(60_000);

test("folder cards stay inside the bottom of the pocket", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("dialog.folder-dialog")).toHaveCount(1);
  const leaks = await page.locator(".project-folder-assembly").evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const cardsOutside: string[] = [];
    for (let y = bounds.bottom + 1; y < bounds.bottom + 22; y += 2) {
      for (let x = bounds.left - 20; x < bounds.right + 20; x += 2) {
        const card = document.elementFromPoint(x, y)?.closest(".folder-project-button");
        if (card) cardsOutside.push(card.getAttribute("aria-label")!);
      }
    }
    return [...new Set(cardsOutside)];
  });
  expect(leaks).toEqual([]);
});

test("popup pointer stays visible and dragging media onto the backdrop does not close it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("dialog.folder-dialog")).toHaveCount(1);
  const card = page.getByRole("button", { name: "Open Velova", exact: true });
  await card.focus();
  await page.keyboard.press("Enter");
  const close = page.getByRole("button", { name: "Close project", exact: true });
  await close.hover();
  expect.soft(await close.evaluate((element) => getComputedStyle(element).cursor)).toBe("pointer");
  const media = await page.locator(".folder-viewer-media").boundingBox();
  await page.mouse.move(media!.x + media!.width / 2, media!.y + 20);
  await page.mouse.down();
  await page.mouse.move(20, media!.y + 20, { steps: 6 });
  await page.mouse.up();
  await expect(page.getByRole("dialog", { name: "Velova", exact: true })).toBeVisible();
  await close.click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(card).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe("hidden");
  await card.press("Enter");
  await page.getByRole("dialog", { name: "Velova", exact: true }).waitFor();
  await page.mouse.click(20, 300);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("folder lives beside the hero and springs back after a bounded drag", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("dialog.folder-dialog")).toHaveCount(1);
  const folder = page.locator(".project-folder-assembly");
  await expect(folder).toBeVisible();
  await expect(page.locator(".folder-project-button")).toHaveCount(5);
  const before = await folder.boundingBox();
  const stage = await page.locator(".project-folder-stage").boundingBox();
  const handle = await page.getByRole("button", { name: "Drag project folder" }).boundingBox();
  expect(stage!.x).toBeGreaterThan(650);
  await page.mouse.move(handle!.x + handle!.width / 2, handle!.y + handle!.height / 2);
  await page.mouse.down();
  await page.mouse.move(handle!.x + handle!.width / 2 + 200, handle!.y + handle!.height / 2, { steps: 15 });
  const during = await folder.boundingBox();
  expect(during!.x).toBeGreaterThan(before!.x + 5);
  expect(during!.x + during!.width).toBeLessThan(stage!.x + stage!.width + 20);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.mouse.up();
  await expect.poll(async () => Math.abs((await folder.boundingBox())!.x - before!.x), { timeout: 5000 }).toBeLessThan(2);
  await page.screenshot({ path: test.info().outputPath("hero-folder.png") });
});

test("project viewer and index restore their previous view and keyboard focus", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("dialog.folder-dialog")).toHaveCount(1);
  const card = page.getByRole("button", { name: "Open Velova", exact: true });
  await card.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Velova", exact: true })).toBeVisible();
  await expect(page.locator(".folder-viewer-caption")).toHaveCount(0);
  await expect(page.getByRole("dialog").locator("a")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(card).toBeFocused();
  await page.getByRole("button", { name: "Open project index" }).click();
  await expect(page.getByRole("dialog", { name: "Project index", exact: true })).toBeVisible();
  await expect(page.locator("[data-index-project]")).toHaveCount(5);
  await page.getByRole("dialog").getByRole("button", { name: "Open Maneuver", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Maneuver", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Project index", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Back to folder", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open project index" })).toBeFocused();
});

test("mobile folder and viewer fit the screen and respect reduced motion", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  const page = await context.newPage();
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("dialog.folder-dialog")).toHaveCount(1);
    await expect(page.locator(".project-folder-assembly")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    await page.getByRole("button", { name: "Open project index" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Open Cognexo", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Cognexo", exact: true })).toBeVisible();
    await expect(page.locator("dialog.folder-dialog")).toHaveClass(/is-reduced-motion/);
    const bounds = await page.locator(".folder-viewer-media").boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(391);
    await page.screenshot({ path: test.info().outputPath("mobile-project-viewer.png") });
    await page.getByRole("button", { name: "Close project", exact: true }).click();
    await page.getByRole("button", { name: "Back to folder", exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe("hidden");
  } finally { await context.close(); }
});
