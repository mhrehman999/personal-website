import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/services", "/services/branding", "/work", "/work/velova", "/pricing", "/about", "/contact", "/book-consultation", "/privacy"];

test("public pages render, expose one h1 and include a canonical URL", async ({ page }) => {
  test.setTimeout(120_000);
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("main h1"), `expected exactly one h1 on ${route}`).toHaveCount(1);
    const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonicalHref!).pathname).toBe(route);
  }
});

test("site pages have no serious or critical WCAG 2.2 AA violations", async ({ page }) => {
  test.setTimeout(120_000);
  for (const route of ["/", "/services", "/work", "/pricing", "/about", "/contact", "/privacy"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const seriousViolations = results.violations.filter((item) => item.impact === "critical" || item.impact === "serious");
    expect(seriousViolations.map((item) => ({ id: item.id, targets: item.nodes.map((node) => node.target) })), route).toEqual([]);
  }
});

test("robots and sitemap are served", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  const sitemap = await request.get("/sitemap.xml");
  expect(robots.ok()).toBeTruthy();
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain("/work/velova");
});

test("security headers include nonce based CSP and HSTS", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  const csp = headers["content-security-policy"] ?? "";
  expect(csp).toContain("nonce-");
  expect(csp.match(/script-src ([^;]+)/)?.[1]).not.toContain("unsafe-inline");
  expect(headers["strict-transport-security"]).toContain("max-age=63072000");
  expect(headers["x-content-type-options"]).toBe("nosniff");
});

test("unknown routes use the styled not found page", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  await expect(page.locator("main h1")).toContainText("This page took");
  expect(response?.status()).toBe(404);
});

test("key layouts do not overflow at the five required viewport widths", async ({ page }) => {
  for (const width of [360, 390, 768, 1280, 1536]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/work", "/pricing", "/contact"]) {
      await page.goto(route);
      const sizes = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      expect(sizes.scroll, `${route} overflows at ${width}px`).toBeLessThanOrEqual(sizes.client);
    }
  }
});
