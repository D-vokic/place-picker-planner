import { test, expect } from "@playwright/test";

test.describe("Critical user paths", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    await page.fill('input[type="email"]', "e2e@test.com");
    await page.keyboard.press("Enter");

    await page.getByTestId("available-places").waitFor();
    await page.getByTestId("my-places").waitFor();
  });

  test("open app and enable edit mode", async ({ page }) => {
    await expect(page.getByTestId("available-places")).toBeVisible();
    await expect(page.getByTestId("my-places")).toBeVisible();
  });

  test("add place to My Places", async ({ page }) => {
    const myPlaces = page.getByTestId("my-places").getByTestId("place-item");
    const initialCount = await myPlaces.count();

    const firstAvailable = page
      .getByTestId("available-places")
      .getByTestId("place-item")
      .first();

    const addButton = firstAvailable.locator('[data-testid="add-place"]');
    await expect(addButton).toHaveCount(1);
    await addButton.click();

    const afterCount = await myPlaces.count();
    expect(afterCount === initialCount || afterCount === initialCount + 1).toBe(
      true,
    );
  });

  test("toggle favorite and status", async ({ page }) => {
    const myPlaces = page.getByTestId("my-places").getByTestId("place-item");
    await expect(myPlaces.first()).toBeVisible();

    const place = myPlaces.first();

    const favoriteButton = place.locator('[data-testid="toggle-favorite"]');
    const statusButton = place.locator('[data-testid="toggle-status"]');

    await expect(favoriteButton).toHaveCount(1);
    await favoriteButton.click();

    await expect(statusButton).toHaveCount(1);
    await statusButton.click();
  });

  test("delete place", async ({ page }) => {
    const myPlaces = page.getByTestId("my-places").getByTestId("place-item");
    const initialCount = await myPlaces.count();

    const firstAvailable = page
      .getByTestId("available-places")
      .getByTestId("place-item")
      .first();

    const addButton = firstAvailable.locator('[data-testid="add-place"]');

    if ((await addButton.count()) === 1) {
      await addButton.click();
    }

    const countAfterAdd = await myPlaces.count();

    const placeToDelete =
      countAfterAdd > initialCount ? myPlaces.last() : myPlaces.first();

    const deleteButton = placeToDelete.locator('[data-testid="delete-place"]');

    await expect(deleteButton).toHaveCount(1);
    await deleteButton.click();

    const confirmButton = page.getByTestId("confirm-delete");
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    await expect(myPlaces).toHaveCount(countAfterAdd - 1);
  });
});
