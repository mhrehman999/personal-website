import { expect, test } from "@playwright/test";

test.setTimeout(90_000);

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/contact?service=branding&items=branding:logo-design", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-entry-phase="ready"]')).toBeVisible({ timeout: 15000 });
});

test("contact links and fields stay distinct on hover and keyboard focus", async ({ page }) => {
  for (const link of await page.locator(".contact-aside a").all()) {
    await link.hover();
    await expect(link).toHaveCSS("background-color", "rgb(246, 59, 5)");
    await expect(link).toHaveCSS("color", "rgb(7, 7, 7)");
    await link.focus();
    await expect(link).toHaveCSS("outline-color", "rgb(200, 209, 217)");
  }
  const name = page.locator("#contact-name");
  await name.hover();
  await expect(name).toHaveCSS("border-top-color", "rgb(43, 79, 156)");
  await name.focus();
  await expect(name).toHaveCSS("outline-color", "rgb(43, 79, 156)");
  const remove = page.getByRole("button", { name: "Remove Branding: Logo design" });
  await remove.hover();
  await expect(remove).toHaveCSS("background-color", "rgb(246, 59, 5)");
});

test("service choices are readable, keyboard accessible and fit the phone viewport", async ({ page }) => {
  const trigger = page.getByRole("combobox", { name: "Service", exact: true });
  await expect(trigger).toHaveText("Branding");
  await trigger.click();
  const option = page.getByRole("option", { name: "Pitch Deck", exact: true });
  await option.hover();
  await expect(option).toHaveCSS("background-color", "rgb(246, 59, 5)");
  await expect(option).toHaveCSS("color", "rgb(7, 7, 7)");
  await option.click();
  await expect(trigger).toHaveText("Pitch Deck");
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("#contact-service")).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("option", { name: "Pitch Deck", exact: true })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(page.getByRole("option", { name: "Not sure yet", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveText("Not sure yet");
  await page.setViewportSize({ width: 320, height: 740 });
  await trigger.click();
  const bounds = (await page.getByRole("listbox").boundingBox())!;
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("submit and removal controls have clear states without sending an enquiry", async ({ page }) => {
  await page.route("**/api/contact", () => { throw new Error("This test must not send an enquiry"); });
  const submit = page.getByRole("button", { name: "Send project enquiry", exact: true });
  // Exercise the enabled visual state without bypassing the real form's spam protection or submitting.
  await submit.evaluate((el: HTMLButtonElement) => { el.disabled = false; });
  await expect(submit).toHaveCSS("background-color", "rgb(246, 59, 5)");
  await submit.hover();
  await expect(submit).toHaveCSS("background-color", "rgb(43, 79, 156)");
  await expect(submit).toHaveCSS("color", "rgb(200, 209, 217)");
  await page.getByRole("button", { name: "Remove Branding: Logo design" }).click();
  await expect(page.locator(".selection-chip")).toHaveCount(0);
  await page.locator(".contact-form").evaluate((el) => el.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
  await expect(page.locator("#contact-name-error")).toBeVisible();
  await expect(page.locator("#contact-email-error")).toBeVisible();
  await expect(page.locator("#contact-name")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#contact-name")).toHaveCSS("border-top-color", "rgb(43, 79, 156)");
});
