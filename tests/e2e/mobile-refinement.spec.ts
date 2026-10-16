import { expect, test } from "@playwright/test";

test.setTimeout(90_000);

test.describe("phone layouts and touch controls", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('[data-entry-phase="ready"]')).toBeVisible();
  });

  test("menu keeps the actual logo, touch target and focus lifecycle", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Open menu", exact: true });
    await trigger.click();
    const menu = page.getByRole("dialog", { name: "Site menu" });
    const logo = menu.locator(".brand-logo-image");
    await expect(logo).toBeVisible();
    expect(await logo.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    const close = menu.getByRole("button", { name: "Close menu", exact: true });
    const bounds = await close.boundingBox();
    expect(bounds!.width).toBeGreaterThanOrEqual(44);
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
    await close.click();
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.click();
    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("expanded service content has breathing room and stays inside each row", async ({ page }) => {
    for (const row of await page.locator(".service-row").all()) {
      await row.locator(".service-row-toggle").click();
      await expect(row.locator(".service-row-toggle")).toHaveAttribute("aria-expanded", "true");
      const layout = await row.evaluate((el) => {
        const inner = el.querySelector<HTMLElement>(".service-row-detail-inner")!;
        const bounds = el.getBoundingClientRect();
        return { padding: parseFloat(getComputedStyle(inner).paddingLeft), contained: Array.from(inner.querySelectorAll("li, a")).every((item) => item.getBoundingClientRect().right <= bounds.right + 1) };
      });
      expect(layout.padding).toBeGreaterThanOrEqual(16);
      expect(layout.contained).toBe(true);
    }
  });

  test("reviews use natural heights and partner invitation is readable on touch", async ({ page }) => {
    const cards = page.locator(".review-card");
    const short = await cards.filter({ hasText: "omarlittler" }).boundingBox();
    const long = await cards.filter({ hasText: "Norbert Katona" }).boundingBox();
    expect(short!.height).toBeLessThan(long!.height * .85);
    const bounds = await cards.evaluateAll((elements) => elements.map((el) => el.getBoundingClientRect().toJSON()));
    expect(bounds.every((box, index) => index === 0 || box.y > bounds[index - 1].bottom)).toBe(true);
    const invite = page.locator(".partner-invite");
    const label = await invite.locator("span").boundingBox();
    const button = await invite.boundingBox();
    expect(label!.x + label!.width).toBeLessThanOrEqual(button!.x + button!.width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test("pricing options open within the viewport and restore focus", async ({ page }) => {
    await page.getByRole("combobox", { name: "Choose a service", exact: true }).click();
    await page.getByRole("option", { name: /Branding/ }).click();
    const trigger = page.locator(".package-dropdown-trigger");
    await trigger.click();
    const panel = page.locator("#package-sub-panel");
    const bounds = await panel.boundingBox();
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(845);
    await panel.getByRole("checkbox").first().click();
    await panel.getByRole("button", { name: "Done" }).click();
    await expect(panel).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(page.locator(".selection-chip")).toHaveCount(1);
  });

  test("touch folder drag leaves vertical page scrolling available", async ({ page }) => {
    const handle = page.getByRole("button", { name: "Drag project folder" });
    await handle.scrollIntoViewIfNeeded();
    const box = await handle.boundingBox();
    const start = { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 };
    const folder = page.locator(".project-folder-assembly");
    const before = await folder.boundingBox();
    const client = await page.context().newCDPSession(page);
    await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
    for (let i = 1; i <= 12; i++) await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: start.x + i * 7, y: start.y }] });
    expect((await folder.boundingBox())!.x - before!.x).toBeGreaterThan(25);
    await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect.poll(async () => Math.abs((await folder.boundingBox())!.x - before!.x)).toBeLessThan(2);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    const beforeScroll = await page.evaluate(() => scrollY);
    await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
    for (let i = 1; i <= 12; i++) await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: start.x, y: start.y - i * 10 }] });
    await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(beforeScroll + 30);
    await client.detach();
  });
});

test("folder follows a drag, settles and never opens a project from a drag", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator('[data-entry-phase="ready"]')).toBeVisible();
  const folder = page.locator(".project-folder-assembly");
  const before = await folder.boundingBox();
  const handle = await page.getByRole("button", { name: "Drag project folder" }).boundingBox();
  const start = { x: handle!.x + handle!.width / 2, y: handle!.y + handle!.height / 2 };
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + 150, start.y, { steps: 20 });
  await expect.poll(async () => (await folder.boundingBox())!.x - before!.x).toBeGreaterThan(85);
  await page.mouse.up();
  await expect.poll(async () => Math.abs((await folder.boundingBox())!.x - before!.x), { timeout: 5000 }).toBeLessThan(2);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Open Velova", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Velova", exact: true })).toBeVisible();
});
