import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import palette from "../../content/palette.json";

test("standalone vector artwork decodes with the canonical palette", async ({ page }) => {
  await page.goto("/services", { waitUntil: "domcontentloaded" });
  const images = await page.evaluate(async () => Promise.all(["branding", "pitch-deck", "social-media", "presentation-design"].map(async (name) => {
    const image = new Image();
    image.src = `/services/previews/${name}.svg`;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 480;
    const context = canvas.getContext("2d")!;
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, 720, 480).data;
    let orange = 0;
    let lime = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index] === 246 && pixels[index + 1] === 59 && pixels[index + 2] === 5) orange++;
      if (pixels[index] === 130 && pixels[index + 1] === 219 && pixels[index + 2] === 26) lime++;
    }
    return { name, orange, lime };
  })));
  for (const image of images) {
    expect(image.orange, image.name).toBeGreaterThan(100);
    expect(image.lime, image.name).toBe(0);
  }
});

test("the new palette stays consistent and readable across the main layouts", async ({ page }) => {
  test.setTimeout(180_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });

  for (const route of ["/", "/pricing", "/contact"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);
    const theme = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        palette: Object.fromEntries(["orange", "cloud", "blue", "sky", "black"].map((name) => [name, root.getPropertyValue(`--brand-${name}`).trim()])),
        background: getComputedStyle(document.body).backgroundColor,
        foreground: getComputedStyle(document.body).color,
      };
    });
    expect(theme.palette, route).toEqual(palette);
    expect(theme.background, route).toBe("rgb(200, 209, 217)");
    expect(theme.foreground, route).toBe("rgb(7, 7, 7)");
    const results = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
    expect(results.violations.map((item) => ({ id: item.id, targets: item.nodes.map((node) => node.target) })), route).toEqual([]);
  }

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("dialog.folder-dialog")).toHaveCount(1);
  await expect(page.locator(".hero-notice")).toHaveCSS("color", "rgb(43, 79, 156)");
  await expect(page.locator(".folder-back stop").first()).toHaveCSS("stop-color", "rgb(80, 133, 197)");
  await expect(page.locator(".home-hero .button-primary")).toHaveCSS("background-color", "rgb(246, 59, 5)");
  for (const [selector, colour] of [[".home-hero", "rgb(200, 209, 217)"], [".selected-work", "rgb(7, 7, 7)"], [".home-testimonials", "rgb(43, 79, 156)"], [".home-partners", "rgb(43, 79, 156)"], [".home-closing-cta", "rgb(80, 133, 197)"], [".site-footer", "rgb(7, 7, 7)"]]) {
    await expect(page.locator(selector)).toHaveCSS("background-color", colour);
  }
  await page.screenshot({ path: test.info().outputPath("palette-desktop.png") });
  await page.locator(".home-process").scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath("palette-approach.png") });
  await page.getByRole("combobox", { name: "Choose a service" }).click();
  await page.getByRole("option", { name: /Branding/ }).click();
  await page.locator(".package-dropdown-trigger").click();
  await page.locator(".package-checkbox").first().check();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  const continueButton = page.getByRole("button", { name: "Continue with this brief" });
  await expect(continueButton).toBeEnabled();
  await continueButton.hover();
  await expect(continueButton).toHaveCSS("background-color", "rgb(7, 7, 7)");
  await expect(continueButton).toHaveCSS("color", "rgb(200, 209, 217)");
  await page.locator(".package-card-custom .button-secondary").hover();
  await expect(page.locator(".package-card-custom .button-secondary")).toHaveCSS("color", "rgb(43, 79, 156)");
  await page.screenshot({ path: test.info().outputPath("palette-pricing.png") });
  await expect(page.getByRole("img", { name: "ASUS", exact: true })).toHaveCount(1);
  await page.locator(".partner-invite").hover();
  await expect(page.locator(".partner-scene-complete")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: test.info().outputPath("palette-partners-hover.png") });
  await page.locator(".email-write-button").last().hover();
  await expect(page.locator(".email-write-button").last()).toHaveCSS("background-color", "rgb(7, 7, 7)");
  await expect(page.locator(".footer-wordmark-filled")).toHaveCSS("fill", "rgb(246, 59, 5)");
  await page.locator(".site-footer").scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath("palette-footer.png") });
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.locator(".home-testimonials").scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath("palette-proof.png") });
  await page.locator(".home-closing-cta").scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath("palette-closing.png") });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "Open Velova", exact: true }).press("Enter");
  await page.getByRole("button", { name: "Close project", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${width}px layout`).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: test.info().outputPath("palette-mobile.png") });
});

// Normal motion adds GSAP's pin wrapper; reduced-motion contrast checks cannot cover it.
test("the pinned work gallery keeps its heading and section colours", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".pin-spacer > .selected-work")).toHaveCount(1);
  await expect(page.locator("#selected-work-heading")).toHaveCSS("color", "rgb(200, 209, 217)");
  await expect(page.locator(".selected-work")).toHaveCSS("background-color", "rgb(7, 7, 7)");
});

test("pricing actions fit within the card padding on narrow phones", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    const overflow = await page.locator(".package-card-bottom .button").evaluateAll((buttons) => buttons.filter((button) => {
      const card = button.closest(".package-card")!;
      const style = getComputedStyle(card);
      const outer = card.getBoundingClientRect();
      const bounds = button.getBoundingClientRect();
      return bounds.right > outer.right - parseFloat(style.paddingRight) + 1 || bounds.left < outer.left + parseFloat(style.paddingLeft) - 1 || button.scrollWidth > button.clientWidth;
    }).map((button) => button.textContent));
    expect(overflow, `${width}px pricing actions`).toEqual([]);
  }
  await page.locator(".package-card-featured .button-primary").scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath("palette-mobile-pricing.png") });
});
