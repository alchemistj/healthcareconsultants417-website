import { expect, test } from "playwright/test";
import { listBuiltPages } from "../test/helpers/dist.ts";

const routes = listBuiltPages().map((page) => page.route);
if (routes.length === 0) {
  throw new Error("No built pages in dist/. Run npm run build before npm run test:e2e.");
}

for (const route of routes) {
  test(`${route} has no horizontal scroll`, async ({ page }) => {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test(`${route} header hides on scroll down and returns on scroll up`, async ({ page }) => {
    await page.goto(route);
    const header = page.locator("[data-site-header]");
    await expect(header).toBeVisible();
    const canScroll = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight + 200);
    expect(canScroll, `${route} is too short to scroll`).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 900));
    await expect(header).toHaveClass(/is-away/);
    await page.evaluate(() => window.scrollTo(0, 860));
    await expect(header).not.toHaveClass(/is-away/);
  });

  test(`${route} hamburger matches the desktop links, and the mobile bar is phones only`, async ({ page }) => {
    await page.goto(route);
    const width = page.viewportSize()?.width ?? 0;
    const isPhone = width <= 500;
    const button = page.locator("[data-menu-button]");
    const bar = page.locator(".mobile-bar");
    if (isPhone) {
      await expect(button).toBeVisible();
      await expect(bar).toBeVisible();
      const desktopNav = await page.locator("header .top-bar a, header .quick-nav a").evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.getAttribute("href")),
      );
      await button.click();
      const menu = await page.locator("#mobile-menu a").evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href")));
      expect(menu.slice(0, desktopNav.length)).toEqual(desktopNav);
      const headerHrefs = await page.locator("header a").evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href")));
      for (const href of menu) expect(headerHrefs).toContain(href);
    } else {
      await expect(button).toBeHidden();
      await expect(bar).toBeHidden();
    }
  });

  test(`${route} makes no third-party requests on load`, async ({ page }) => {
    const third: string[] = [];
    page.on("request", (request) => {
      const url = request.url();
      if (url.startsWith("data:") || url.startsWith("blob:")) return;
      const host = new URL(url).hostname;
      if (host !== "127.0.0.1" && host !== "localhost") third.push(url);
    });
    const response = await page.goto(route);
    expect(response?.status()).toBeLessThan(400);
    expect(third).toEqual([]);
  });
}
