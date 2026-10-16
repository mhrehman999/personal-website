import { expect, test } from "@playwright/test";

test("hero motion, uncropped palette sheets and requested finishing details", async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".folder-project-button")).toHaveCount(5);
  await page.locator(".folder-entrance").evaluate(async (node) => {
    await Promise.all(node.getAnimations({ subtree: true }).filter(animation => animation.effect?.getTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {})));
  });
  await expect(page.locator(".folder-front-label")).toHaveText("Projects Folder");
  await expect(page.locator(".folder-front-count, .project-folder-toolbar > span, .process-footnote, .folder-instructions")).toHaveCount(0);
  await expect(page.locator(".home-hero-title .load-word")).toHaveCount(7);
  await expect(page.locator("#home-title")).toHaveCSS("text-transform", "uppercase");
  expect(await page.locator(".home-hero-title").evaluate(node => getComputedStyle(node).fontFamily)).toContain("anton");
  const heroSurface = await page.locator(".home-hero").evaluate(node => {
    const surface = getComputedStyle(node, "::after");
    return { border: surface.borderWidth, radius: surface.borderRadius, inset: surface.inset };
  });
  expect(heroSurface).toEqual({ border: "0px", radius: "0px", inset: "0px" });
  const heroBounds = (await page.locator(".home-hero").boundingBox())!;
  const marqueeBounds = (await page.locator(".keyword-marquee").boundingBox())!;
  expect(Math.abs(heroBounds.y + heroBounds.height - marqueeBounds.y)).toBeLessThan(1);
  expect((await page.locator(".hero-flow").boundingBox())!.width).toBeLessThan(heroBounds.width * .7);
  const heroCurrent = page.locator(".hero-flow i").first();
  const heroCurrentStart = await heroCurrent.evaluate(node => getComputedStyle(node).transform);
  await expect.poll(() => heroCurrent.evaluate(node => getComputedStyle(node).transform)).not.toBe(heroCurrentStart);
  const indexButton = page.getByRole("button", { name: "Open project index", exact: true });
  await expect(indexButton).toHaveCSS("animation-play-state", "running");
  expect(await indexButton.evaluate(node => getComputedStyle(node).backdropFilter)).toContain("blur");
  const floatStart = await indexButton.evaluate(node => getComputedStyle(node).transform);
  await expect.poll(() => indexButton.evaluate(node => getComputedStyle(node).transform)).not.toBe(floatStart);
  // Move the pointer directly: locator.hover waits for a stable target,
  // whereas this button intentionally floats until the pointer enters it.
  const indexBounds = (await indexButton.boundingBox())!;
  await page.mouse.move(indexBounds.x + indexBounds.width / 2, indexBounds.y + indexBounds.height / 2);
  await expect(indexButton).toHaveCSS("animation-play-state", "paused");
  const stopped = await indexButton.evaluate(async node => {
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return getComputedStyle(node).transform;
  });
  expect(await indexButton.evaluate(async node => {
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return getComputedStyle(node).transform;
  })).toBe(stopped);
  await page.mouse.move(5, 5);
  await expect(indexButton).toHaveCSS("animation-play-state", "running");
  const subheading = await page.locator(".home-hero-eyebrow").evaluate(node => ({ color: getComputedStyle(node).color, previous: getComputedStyle(node).getPropertyValue("--fg-2").trim(), background: getComputedStyle(node).backgroundColor }));
  expect(subheading.background).toBe("rgba(0, 0, 0, 0)");
  expect(subheading.color).not.toBe("rgb(246, 59, 5)");
  await expect(page.locator(".folder-card-pocket")).toHaveCSS("clip-path", "none");
  const sheets = await page.locator(".folder-project-button .project-media").evaluateAll(nodes => nodes.map(node => getComputedStyle(node).backgroundColor));
  expect(new Set(sheets).size).toBe(5);
  expect(sheets).toEqual(["rgb(43, 79, 156)", "rgb(80, 133, 197)", "rgb(200, 209, 217)", "rgb(7, 7, 7)", "rgb(246, 59, 5)"]);
  const folder = page.locator(".project-folder-assembly");
  const before = (await folder.boundingBox())!;
  // File bottoms physically remain above the folder base without a clip-path.
  const bottoms = await page.locator(".folder-project-button").evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().bottom));
  expect(Math.max(...bottoms)).toBeLessThan(before.y + before.height);
  expect(await folder.evaluate(node => getComputedStyle(node).getPropertyValue("-webkit-box-reflect"))).toContain("below");
  const handle = (await page.locator(".project-folder-handle").boundingBox())!;
  for (const direction of [1, -1]) {
    await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
    await page.mouse.down();
    await page.mouse.move(handle.x + handle.width / 2 + direction * 180, handle.y + handle.height / 2, { steps: 12 });
    const moved = (await folder.boundingBox())!;
    expect(Math.abs(moved.x - before.x)).toBeGreaterThan(25);
    await page.mouse.up();
    await expect.poll(async () => Math.abs((await folder.boundingBox())!.x - before.x)).toBeLessThan(2);
  }
  await page.screenshot({ path: test.info().outputPath("hero-folder-desktop.png") });
  const groups = page.locator(".keyword-marquee-group");
  await expect(groups).toHaveCount(2);
  await expect(groups.first().locator(".keyword-marquee-word")).toHaveCount(8);
  expect((await groups.first().boundingBox())!.width).toBeGreaterThanOrEqual(1440);
  expect(await groups.nth(0).innerHTML()).toBe(await groups.nth(1).innerHTML());
  const marquee = page.locator(".keyword-marquee-track");
  const initial = await marquee.evaluate(node => getComputedStyle(node).transform);
  await expect.poll(() => marquee.evaluate(node => getComputedStyle(node).transform)).not.toBe(initial);
  await page.locator("#home-intro").scrollIntoViewIfNeeded();
  await expect(page.locator("#home-intro-title")).toHaveCount(0);
  await expect(page.locator(".home-intro-statement")).toHaveCSS("text-transform", "uppercase");
  await expect(page.locator(".intro-flow i")).toHaveCount(3);
  await expect(page.locator(".intro-flow i").first()).toHaveCSS("animation-name", "intro-water");
  const current = page.locator(".intro-flow i").first();
  const initialCurrent = await current.evaluate(node => getComputedStyle(node).transform);
  await expect.poll(() => current.evaluate(node => getComputedStyle(node).transform)).not.toBe(initialCurrent);
  await page.screenshot({ path: test.info().outputPath("intro-liquid-glass.png") });
  await page.locator(".intro-flow").evaluate(node => {
    node.getAnimations({ subtree: true }).forEach(animation => { animation.currentTime = Number(animation.currentTime ?? 0) + 6000; });
  });
  await page.screenshot({ path: test.info().outputPath("intro-liquid-glass-later.png") });
  const pitch = page.locator(".service-row").nth(1);
  await pitch.evaluate(node => node.scrollIntoView({ block: "center", behavior: "instant" }));
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
  await pitch.hover();
  await expect(page.locator(".service-hover-preview")).toHaveClass(/is-visible/);
  await expect(page.locator(".service-preview-image.is-active img")).toHaveCSS("object-fit", "contain");
  await expect(page.locator(".service-preview-caption")).toHaveCSS("background-color", "rgb(7, 7, 7)");
  await expect(page.locator(".service-preview-caption > span").first()).toHaveCSS("color", "rgb(200, 209, 217)");
  await page.screenshot({ path: test.info().outputPath("pitch-preview-contained.png") });
  await expect(page.locator(".process-contact-link")).toHaveCSS("background-color", "rgb(246, 59, 5)");
  await expect(page.locator(".process-contact-link .button-icon")).toHaveCSS("color", "rgb(246, 59, 5)");
  await page.getByRole("button", { name: "Open Velova", exact: true }).press("Enter");
  await expect(page.getByRole("dialog", { name: "Velova", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close project", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("small screens fit the type and complete file fan, with reduced motion", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  const page = await context.newPage();
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".project-folder")).toHaveClass(/is-reduced-motion/);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".folder-entrance")).toHaveCSS("animation-name", "none");
    await expect(page.locator(".folder-index-toggle")).toHaveCSS("animation-name", "none");
    await expect(page.locator(".hero-flow i").first()).toHaveCSS("animation-name", "none");
    await expect(page.locator(".intro-flow i").first()).toHaveCSS("animation-name", "none");
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const title = (await page.locator("#home-title").boundingBox())!;
      const lines = await page.locator(".hero-title-line").evaluateAll(nodes => nodes.map(node => node.scrollWidth));
      expect(Math.max(...lines)).toBeLessThanOrEqual(title.width + 1);
      const header = (await page.locator(".site-header").boundingBox())!;
      const eyebrow = (await page.locator(".home-hero-eyebrow").boundingBox())!;
      expect(eyebrow.y - header.y - header.height).toBeGreaterThanOrEqual(24);
      for (const selector of [".home-intro-statement"]) {
        expect(await page.locator(selector).evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator(".project-folder").scrollIntoViewIfNeeded();
    await page.screenshot({ path: test.info().outputPath("folder-mobile.png") });
    await page.getByRole("button", { name: "Open project index" }).click();
    await expect(page.locator("[data-index-project]")).toHaveCount(5);
    await page.getByRole("button", { name: "Back to folder", exact: true }).click();
  } finally { await context.close(); }
});
