import { expect, test } from "@playwright/test";

test("loader hands off to the hero and does not replay on client navigation", async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const loader = page.getByRole("status", { name: "Loading portfolio" });
  await expect(loader).toBeVisible({ timeout: 3000 });
  await expect(page.locator(".site-background")).toHaveAttribute("inert", "");
  await expect(page.locator(".home-hero-title .load-word").first()).toHaveCSS("animation-name", "none");
  await page.screenshot({ path: test.info().outputPath("branded-loader.png") });
  await expect(loader).toHaveCount(0, { timeout: 7000 });
  await expect(page.locator(".site-background")).toHaveAttribute("data-entry-phase", "ready");
  await expect(page.locator(".site-background")).not.toHaveAttribute("inert", "");
  expect(await page.evaluate(() => document.documentElement.classList.contains("is-loading-site"))).toBe(false);
  await expect(page.locator(".home-hero-support")).toHaveCSS("text-transform", "uppercase");
  await expect(page.locator("#home-intro-title")).toHaveCount(0);
  await expect(page.locator(".selected-work .eyebrow")).not.toHaveCSS("color", "rgb(246, 59, 5)");
  for (const selector of [".home-hero-eyebrow", ".home-scroll-cue", ".home-hero-actions .button-secondary"]) {
    expect(await page.locator(selector).evaluate(node => getComputedStyle(node).backdropFilter)).toContain("blur");
    await expect(page.locator(selector)).toHaveCSS("color", "rgb(43, 79, 156)");
  }
  expect(await page.locator(".home-scroll-cue i").evaluate(node => node.getBoundingClientRect().width)).toBeGreaterThanOrEqual(3);
  expect(await page.locator(".site-header .brand-logo-image").evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
  const notice = page.locator(".hero-notice-ink");
  await notice.evaluate(node => { const animation = node.getAnimations()[0]; animation.pause(); animation.currentTime = 6500; });
  await expect(notice).toHaveCSS("color", "rgb(246, 59, 5)");
  const arc = page.locator(".hero-notice-arc path");
  await expect(arc).toHaveCSS("stroke", "rgb(7, 7, 7)");
  await arc.evaluate(node => { const animation = node.getAnimations()[0]; animation.pause(); animation.currentTime = 6500; });
  await page.screenshot({ path: test.info().outputPath("hero-glass-and-notice.png") });
  await notice.evaluate(node => { node.getAnimations()[0].currentTime = 10000; });
  await expect(notice).toHaveCSS("color", "rgb(43, 79, 156)");
  const index = page.locator(".folder-index-toggle");
  const indexBounds = (await index.boundingBox())!;
  await page.mouse.move(indexBounds.x + indexBounds.width / 2, indexBounds.y + indexBounds.height / 2);
  await expect(index).toHaveCSS("color", "rgb(200, 209, 217)");
  await expect(index).toHaveCSS("animation-play-state", "paused");
  await expect.poll(() => index.evaluate(node => getComputedStyle(node, "::before").opacity)).toBe("1");
  await page.locator(".folder-front").hover();
  await expect(page.locator(".folder-hover-wash")).toHaveCSS("opacity", "1");
  await expect(page.locator(".project-folder-handle")).toHaveCSS("color", "rgb(7, 7, 7)");
  await page.screenshot({ path: test.info().outputPath("orange-folder-hover.png") });
  await page.mouse.move(5, 5);
  await expect(page.locator(".folder-hover-wash")).toHaveCSS("opacity", "0");
  await expect(page.locator(".section-action")).toHaveCount(3);
  for (const action of await page.locator(".section-action").all()) {
    await expect(action).toHaveCSS("background-color", "rgb(7, 7, 7)");
    await expect(action.locator(".button-icon")).toHaveCSS("background-color", "rgb(246, 59, 5)");
  }
  await expect(page.locator(".partners-title-better")).toHaveCSS("color", "rgb(246, 59, 5)");
  await expect(page.locator(".partners-title-together")).toHaveCSS("color", "rgb(7, 7, 7)");
  const row = page.locator(".service-row").first();
  await expect(row.locator(".service-row-arrow")).toHaveCSS("color", "rgb(246, 59, 5)");
  await row.evaluate(node => node.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.evaluate(() => new Promise<void>(resolve => {
    let previous = scrollY;
    let settled = 0;
    const check = () => {
      settled = Math.abs(scrollY - previous) < .1 ? settled + 1 : 0;
      previous = scrollY;
      if (settled >= 12) resolve(); else requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  }));
  await row.hover();
  await expect(row).toHaveCSS("background-color", "rgb(246, 59, 5)");
  await expect(row.locator(".service-row-title")).toHaveCSS("color", "rgb(7, 7, 7)");
  await expect(page.locator(".service-hover-preview")).toHaveClass(/is-visible/);
  await page.screenshot({ path: test.info().outputPath("orange-service-hover.png") });
  await page.locator(".faq-trigger").first().click();
  await expect(page.locator(".faq-trigger").first()).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".faq-trigger").first()).toHaveCSS("color", "rgb(246, 59, 5)");
  await expect(page.locator(".faq-plus").first()).toHaveCSS("color", "rgb(246, 59, 5)");
  await page.getByRole("link", { name: "Explore services", exact: true }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(loader).toHaveCount(0);
  await expect(page.locator("main h1")).toBeVisible();
});

test("failed covers and a never-ready font cannot trap the loader, and keyboard focus gets the service state", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(document.fonts, "ready", { value: new Promise<void>(() => {}), configurable: true });
  });
  await page.route("**/_next/image?*", route => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".site-background")).toHaveAttribute("data-entry-phase", "ready", { timeout: 7000 });
  await page.locator(".service-row-main").first().focus();
  await expect(page.locator(".service-row").first()).toHaveCSS("background-color", "rgb(246, 59, 5)");
  expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe("hidden");
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test("loader keeps the full 100 percent counter visible", async ({ page: mobile }) => {
    test.setTimeout(60_000);
    // Freeze the short-lived overlay for layout inspection; do not slow the product.
    await mobile.clock.install();
    await mobile.clock.pauseAt(await mobile.evaluate(() => Date.now() + 1000));
    await mobile.goto("/", { waitUntil: "domcontentloaded" });
    await mobile.clock.runFor(200);
    await expect(mobile.locator(".site-loader")).toBeVisible();
    await mobile.evaluate(() => document.fonts.ready);
    const bounds = (await mobile.locator(".site-loader-message").boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
    await mobile.locator(".site-loader").evaluate(node => (node as HTMLElement).style.setProperty("--loader-progress", "100"));
    await mobile.screenshot({ path: test.info().outputPath("branded-loader-mobile.png") });
    expect(await mobile.locator(".site-loader-counter").evaluate(node => {
      const style = getComputedStyle(node);
      const context = document.createElement("canvas").getContext("2d")!;
      context.font = `${style.fontSize} ${style.fontFamily}`;
      const text = context.measureText("100%");
      return node.clientHeight > text.actualBoundingBoxAscent + text.actualBoundingBoxDescent + 24;
    })).toBe(true);
    const glyphBounds = await mobile.locator(".site-loader-counter").evaluate(node => {
      const window = node.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(node.querySelector(".site-loader-counter-stack > span:last-child")!);
      const ink = range.getBoundingClientRect();
      return { top: ink.top - window.top, bottom: ink.bottom - window.bottom, left: ink.left - window.left, right: ink.right - window.right };
    });
    expect(glyphBounds.top).toBeGreaterThanOrEqual(-1);
    expect(glyphBounds.bottom).toBeLessThanOrEqual(1);
    expect(glyphBounds.left).toBeGreaterThanOrEqual(-1);
    expect(glyphBounds.right).toBeLessThanOrEqual(1);
    await mobile.clock.fastForward(6000);
    await mobile.clock.resume();
    await expect(mobile.locator(".site-loader")).toHaveCount(0, { timeout: 7000 });
  });
  test("reduced motion keeps the layout and service arrows clear", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".site-loader")).toHaveCount(0);
    await expect(page.locator(".site-background")).toHaveAttribute("data-entry-phase", "ready");
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const copy = (await page.locator(".service-row-copy").last().boundingBox())!;
      const arrow = (await page.locator(".service-row-arrow").last().boundingBox())!;
      expect(copy.x + copy.width).toBeLessThanOrEqual(arrow.x);
    }
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("entry leaves content and navigation usable", async ({ page: staticPage }) => {
    await staticPage.goto("/", { waitUntil: "domcontentloaded" });
    await expect(staticPage.locator(".site-loader")).toBeHidden();
    await expect(staticPage.locator(".site-background")).not.toHaveAttribute("inert", "");
    await expect(staticPage.getByRole("heading", { name: "I design the difference people actually notice.", exact: true })).toBeVisible();
  });
});
