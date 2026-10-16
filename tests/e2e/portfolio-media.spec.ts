import { expect, test } from "@playwright/test";

test("supplied portfolio videos play, fall back to covers and open without reference links", async ({ page }) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".folder-project-button")).toHaveCount(5);
  await expect(page.locator(".folder-project-button video")).toHaveCount(3);
  const heroVideo = page.locator(".folder-project-button video").first();
  await expect.poll(() => heroVideo.evaluate((node: HTMLVideoElement) => !node.paused && node.currentTime > 0 && node.videoWidth > 0)).toBe(true);
  await page.screenshot({ path: test.info().outputPath("owned-folder-desktop.png") });

  const cards = page.locator(".selected-work .project-card");
  await expect(cards).toHaveCount(3);
  for (let index = 0; index < 3; index++) {
    const card = cards.nth(index);
    await card.scrollIntoViewIfNeeded();
    const video = card.locator("video");
    await expect.poll(() => video.evaluate((node: HTMLVideoElement) => !node.paused && node.currentTime > 0)).toBe(true);
    expect(await video.evaluate((node: HTMLVideoElement) => ({ loop: node.loop, muted: node.muted, inline: node.playsInline, autoplay: node.autoplay }))).toEqual({ loop: true, muted: true, inline: true, autoplay: true });
  }
  await cards.first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath("owned-selected-work.png") });
  await cards.first().locator("video").evaluate((node) => node.dispatchEvent(new Event("error")));
  await expect(cards.first().locator("video")).toHaveCount(0);
  const fallback = cards.first().locator("img");
  await expect(fallback).toHaveCSS("opacity", "1");
  expect(await fallback.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);

  await page.getByRole("button", { name: "Open Velova", exact: true }).press("Enter");
  const dialog = page.getByRole("dialog", { name: "Velova", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("a")).toHaveCount(0);
  await expect(dialog).not.toContainText(/reference|vivekvisualss/i);
  await expect(page.locator(".folder-viewer-caption")).toHaveCount(0);
  await expect.poll(() => dialog.locator("video").evaluate((node: HTMLVideoElement) => !node.paused && node.currentTime > 0)).toBe(true);
  await dialog.getByRole("button", { name: "Pause preview", exact: true }).click();
  expect(await dialog.locator("video").evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);
  await dialog.getByRole("button", { name: "Play preview", exact: true }).click();
  await page.screenshot({ path: test.info().outputPath("owned-project-popup.png") });
  await dialog.getByRole("button", { name: "Index", exact: true }).click();
  await expect(page.locator("[data-index-project]")).toHaveCount(5);
  await expect(page.getByRole("dialog").locator("a")).toHaveCount(0);
  await page.getByRole("button", { name: "Back to folder", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  for (const [index, name] of ["cognexo", "velova", "misk", "neeca"].entries()) {
    const row = page.locator(".service-row").nth(index);
    await row.hover();
    await expect(page.locator(".service-hover-preview")).toHaveClass(/is-visible/);
    const image = page.locator(".service-preview-image.is-active img");
    expect(await image.evaluate((node: HTMLImageElement) => decodeURIComponent(node.src))).toContain(`/work/${name}/cover.webp`);
    await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
  }
  await page.screenshot({ path: test.info().outputPath("owned-service-preview.png") });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.screenshot({ path: test.info().outputPath("owned-folder-mobile.png") });
  await page.getByRole("button", { name: "Open project index", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Open MISK", exact: true }).click();
  const bounds = await page.locator(".folder-viewer-media").boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(391);
  await expect(page.getByRole("dialog").locator("a")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Back to folder", exact: true }).click();

  await page.goto("/work");
  await expect(page.locator(".portfolio-card")).toHaveCount(8);
  await expect(page.locator("main")).not.toContainText("TODO:");
});
