import { expect, test } from "@playwright/test";

test.setTimeout(90_000);

async function ready(page: import("@playwright/test").Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-entry-phase="ready"]')).toBeVisible({ timeout: 15_000 });
}

test("shared cursor follows precisely, responds to links and projects, and works in the footer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await ready(page, "/work");
  const cursor = page.locator(".site-cursor");
  await expect(cursor).toHaveCount(1);
  await expect(cursor).toHaveAttribute("aria-hidden", "true");
  await page.mouse.move(500, 300);
  await expect(cursor).toHaveAttribute("data-visible", "true");
  await expect(cursor.locator(".site-cursor-point")).toHaveCSS("background-color", "rgb(246, 59, 5)");
  await expect(cursor.locator(".site-cursor-halo")).toHaveCSS("border-top-color", "rgb(43, 79, 156)");
  // A rapid move ends exactly at the pointer; no spring or trailing loop.
  for (let index = 0; index < 10; index++) await page.mouse.move(250 + index * 40, 290 + index * 5);
  await expect.poll(() => cursor.evaluate(el => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    return [matrix.m41, matrix.m42];
  })).toEqual([610, 335]);
  await page.locator('.site-header a[href="/about"]').hover();
  await expect(cursor).toHaveAttribute("data-state", "link");
  await expect(cursor.locator(".site-cursor-halo")).toHaveCSS("border-top-color", "rgb(246, 59, 5)");
  await expect(cursor.locator(".site-cursor-action")).toHaveCSS("opacity", "0");
  await page.mouse.down();
  await expect(cursor).toHaveAttribute("data-pressed", "true");
  await page.mouse.move(500, 300);
  await page.mouse.up();
  await expect(cursor).toHaveAttribute("data-pressed", "false");
  await page.locator(".portfolio-card-link").first().hover();
  await expect(cursor).toHaveAttribute("data-state", "project");
  await expect(cursor.locator(".site-cursor-label")).toHaveText("View");
  const footer = page.locator(".site-footer");
  await footer.scrollIntoViewIfNeeded();
  const box = (await footer.boundingBox())!;
  await page.mouse.move(180, Math.max(180, box.y + 150));
  await expect(cursor).toHaveAttribute("data-visible", "true");
  await expect(footer).toHaveCSS("cursor", "none");
  expect(await cursor.evaluate(el => getComputedStyle(el).pointerEvents)).toBe("none");
  expect(await cursor.evaluate(el => new Promise<number>(resolve => {
    let paints = 0;
    const observer = new MutationObserver(records => { paints += records.length; });
    observer.observe(el, { attributes: true, attributeFilter: ["style"] });
    window.setTimeout(() => { observer.disconnect(); resolve(paints); }, 350);
  }))).toBe(0);
  await page.keyboard.press("Tab");
  await expect(page.locator("html")).not.toHaveClass(/has-custom-cursor/);
  await page.mouse.move(600, 300);
  await expect(cursor).toHaveAttribute("data-visible", "true");
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect(page.locator("html")).not.toHaveClass(/has-custom-cursor/);
});

test("cursor restores native editing, dropdown, drag and dialog behavior across routes", async ({ page }) => {
  await ready(page, "/contact");
  const cursor = page.locator(".site-cursor");
  await page.locator("#contact-message").hover();
  await expect(page.locator("html")).not.toHaveClass(/has-custom-cursor/);
  await expect(page.locator("#contact-message")).toHaveCSS("cursor", "text");
  await page.getByRole("combobox", { name: "Service", exact: true }).hover();
  await expect(page.locator("html")).not.toHaveClass(/has-custom-cursor/);
  await page.locator('.site-header a[href="/"]').first().click();
  await expect(page.locator(".home-hero")).toBeVisible();
  await expect(cursor).toHaveCount(1);
  await page.getByRole("button", { name: "Drag project folder", exact: true }).hover();
  await expect(page.locator("html")).not.toHaveClass(/has-custom-cursor/);
  await expect(page.getByRole("button", { name: "Drag project folder", exact: true })).toHaveCSS("cursor", "grab");
  const handle = (await page.getByRole("button", { name: "Drag project folder", exact: true }).boundingBox())!;
  await page.mouse.down();
  await page.mouse.move(handle.x + handle.width / 2 + 50, handle.y + handle.height / 2, { steps: 8 });
  await expect(page.locator(".project-folder-assembly")).toHaveClass(/is-dragging/);
  await expect(page.locator("html")).not.toHaveClass(/has-custom-cursor/);
  await page.mouse.up();
  // The index floats continuously; keyboard activation also checks the accessible route.
  await page.getByRole("button", { name: "Open project index", exact: true }).focus();
  await page.keyboard.press("Enter");
  await page.getByRole("dialog").hover({ position: { x: 10, y: 10 } });
  await expect(page.locator("html")).not.toHaveClass(/has-custom-cursor/);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.mouse.move(400, 300);
  await expect(cursor).toHaveAttribute("data-visible", "true");
});

test("cursor respects reduced motion and touch without hiding the native pointer", async ({ page, browser }) => {
  await ready(page, "/about");
  await page.mouse.move(300, 250);
  await expect(page.locator("html")).toHaveClass(/has-custom-cursor/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveClass(/has-custom-cursor/);
  await page.mouse.move(350, 250);
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-visible", "false");
  await expect(page.locator(".site-cursor")).toHaveCSS("display", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.mouse.move(400, 250);
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-visible", "true");
  await page.emulateMedia({ forcedColors: "active" });
  await page.mouse.move(450, 250);
  await expect(page.locator("html")).not.toHaveClass(/has-custom-cursor/);
  await expect(page.locator(".site-cursor")).toHaveCSS("display", "none");
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const phone = await mobile.newPage();
    await ready(phone, "/");
    await phone.locator(".home-hero h1").tap();
    await expect(phone.locator("html")).not.toHaveClass(/has-custom-cursor/);
    await expect(phone.locator(".site-cursor")).toHaveCSS("display", "none");
    expect(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } finally { await mobile.close(); }
});
