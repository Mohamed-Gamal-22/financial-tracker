import { expect, test } from "@playwright/test";

async function stubGuestSession(page: import("@playwright/test").Page) {
  await page.route("**/api/auth/**", async (route) => {
    const url = route.request().url();
    if (url.includes("/session")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}),
      });
      return;
    }
    if (url.includes("/csrf")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ csrfToken: "test-csrf" }),
      });
      return;
    }
    if (url.includes("/providers")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          credentials: { id: "credentials", name: "Credentials", type: "credentials" },
        }),
      });
      return;
    }
    await route.continue();
  });
}

test.describe("guest smoke", () => {
  test.beforeEach(async ({ page }) => {
    await stubGuestSession(page);
  });

  test("landing page shows Masrofy hero", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByText("أهلاً بالحرية المالية مع مصروفي!"),
    ).toBeVisible({ timeout: 30_000 });
  });

  test("login page renders credentials form", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("button", { name: "تسجيل الدخول إلى الحساب" }),
    ).toBeVisible({ timeout: 30_000 });
    await expect(page.getByPlaceholder("name@company.com")).toBeVisible();
  });

  test("register page is reachable", async ({ page }) => {
    await page.goto("/register", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/register/);
    await expect(page.locator("form").first()).toBeVisible({ timeout: 30_000 });
  });

  test("forgot-password page is reachable", async ({ page }) => {
    await page.goto("/forgot-password", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/forgot-password/);
    await expect(page.locator("form").first()).toBeVisible({ timeout: 30_000 });
  });

  test("protected dashboard redirects guests to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/login/);
  });

  test("protected transactions redirects guests to login", async ({ page }) => {
    await page.goto("/transactions");
    await expect(page).toHaveURL(/login/);
  });
});
