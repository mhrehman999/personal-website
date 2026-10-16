import { expect, test } from "@playwright/test";

test.setTimeout(90_000);

test("consultation page has a useful brief, direct alternatives and mobile-safe controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/book-consultation", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-entry-phase="ready"]')).toBeVisible({ timeout: 15000 });
  await expect(page.locator("main")).not.toContainText(/TODO:|booking link needed/);
  await expect(page.locator(".booking-agenda")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Choose a time. Bring the idea." })).toBeVisible();
  const direct = page.getByRole("link", { name: "Open calendar", exact: true });
  await expect(direct).toHaveAttribute("href", /https:\/\/cal\.com\/muhammad-haris-rehman-ajg0fi\/15min/);
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px`).toBe(true);
    const overflow = await page.locator("main").evaluate((el) => Array.from(el.querySelectorAll("a, h1, h2, p")).some((item) => { const box = item.getBoundingClientRect(); return box.width > 0 && (box.right > innerWidth + 1 || box.left < 0); }));
    expect(overflow, `${width}px`).toBe(false);
  }
  await page.getByRole("link", { name: "Choose a time", exact: true }).click();
  await expect(page).toHaveURL(/#choose-time$/);
});

test("blocked calendar loading gives a useful fallback instead of an empty frame", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("https://app.cal.com/**", (route) => route.abort());
  await page.goto("/book-consultation", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-entry-phase="ready"]')).toBeVisible({ timeout: 15000 });
  const shell = page.locator(".booking-embed-shell");
  await expect(shell).toHaveAttribute("data-state", "slow", { timeout: 12000 });
  await expect(page.getByText("The calendar is taking a little longer.", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open calendar", exact: true })).toBeVisible();
  expect((await shell.boundingBox())!.height).toBeLessThan(400);
});

test("calendar ready and failure events update the wrapper without a booking", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.addInitScript(() => {
    const state = { callbacks: {} as Record<string, () => void>, eventPath: "", ui: {} as Record<string, unknown> };
    const api = (command: string, options: { action?: string; callback?: () => void; calLink?: string; elementOrSelector?: HTMLElement }) => {
      if (command === "on" && options.action && options.callback) state.callbacks[options.action] = options.callback;
      if (command === "off" && options.action) delete state.callbacks[options.action];
      if (command === "inline") { state.eventPath = options.calLink ?? ""; const frame = document.createElement("iframe"); frame.title = "Test calendar surface"; options.elementOrSelector?.append(frame); }
      if (command === "ui") state.ui = options;
    };
    Object.assign(window, { __bookingTest: state, Cal: Object.assign(() => {}, { loaded: true, ns: { "studio-discovery": api } }) });
  });
  await page.goto("/book-consultation", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-entry-phase="ready"]')).toBeVisible({ timeout: 15000 });
  const state = () => page.evaluate(() => (window as unknown as { __bookingTest: { callbacks: Record<string, () => void>; eventPath: string } }).__bookingTest);
  await expect.poll(async () => (await state()).eventPath).toBe("muhammad-haris-rehman-ajg0fi/15min");
  await page.clock.fastForward(8100);
  await expect(page.locator(".booking-embed-shell")).toHaveAttribute("data-state", "slow");
  expect((await page.locator(".booking-embed-shell").boundingBox())!.height).toBeLessThan(400);
  await page.getByText("Show calendar here", { exact: true }).click();
  await expect(page.locator(".booking-cal-instance iframe")).toBeVisible();
  await page.evaluate(() => (window as unknown as { __bookingTest: { callbacks: Record<string, () => void> } }).__bookingTest.callbacks.linkReady());
  await expect(page.locator(".booking-embed-shell")).toHaveAttribute("data-state", "ready");
  await expect(page.locator(".booking-status")).toHaveCount(0);
  await page.evaluate(() => (window as unknown as { __bookingTest: { callbacks: Record<string, () => void> } }).__bookingTest.callbacks.linkFailed());
  await expect(page.locator(".booking-embed-shell")).toHaveAttribute("data-state", "failed");
  await expect(page.getByText("Let's find another way to connect.", { exact: true })).toBeVisible();
  expect((await page.locator(".booking-embed-shell").boundingBox())!.height).toBeLessThan(400);
  await page.evaluate(() => (window as unknown as { __bookingTest: { callbacks: Record<string, (event: CustomEvent) => void> } }).__bookingTest.callbacks["*"](new CustomEvent("calendar", { detail: { type: "bookerReady" } })));
  await expect(page.locator(".booking-embed-shell")).toHaveAttribute("data-state", "ready");
});
