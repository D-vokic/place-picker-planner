import { test, expect } from "@playwright/test";

test.describe("Critical user paths", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    await page.fill('input[type="email"]', "e2e@test.com");
    await page.keyboard.press("Enter");

    await page.getByTestId("available-places").waitFor();
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

    await firstAvailable.getByTestId("add-place").click();

    await expect(myPlaces).toHaveCount(initialCount + 1);
  });

  test("toggle favorite and status", async ({ page }) => {
    const place = page
      .getByTestId("my-places")
      .getByTestId("place-item")
      .first();

    await place.getByTestId("toggle-favorite").click();
    await place.getByTestId("toggle-status").click();
  });

  test("delete place", async ({ page }) => {
    const myPlaces = page.getByTestId("my-places").getByTestId("place-item");

    const initialCount = await myPlaces.count();

    const firstAvailable = page
      .getByTestId("available-places")
      .getByTestId("place-item")
      .first();

    await firstAvailable.getByTestId("add-place").click();

    await expect(myPlaces).toHaveCount(initialCount + 1);

    const newlyAddedPlace = myPlaces.last();

    await newlyAddedPlace.getByTestId("delete-place").click();
    await page.getByTestId("confirm-delete").click();

    await expect(myPlaces).toHaveCount(initialCount);
  });
});
