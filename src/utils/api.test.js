import { describe, it, expect, beforeEach, vi } from "vitest";

describe("api utilities", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3000");
    global.fetch = vi.fn();
  });

  async function loadApi() {
    return await import("./api.js");
  }

  it("fetches places", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ places: [] }),
    });

    const { fetchPlaces } = await loadApi();
    const result = await fetchPlaces();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/places",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer dev-user",
        }),
      }),
    );

    expect(result).toEqual({ places: [] });
  });

  it("adds user place with POST", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    const { addUserPlace } = await loadApi();
    await addUserPlace({ id: 1 });

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/user-places",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ place: { id: 1 } }),
      }),
    );
  });

  it("removes user place with DELETE", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const { removeUserPlace } = await loadApi();
    const result = await removeUserPlace(5);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/user-places/5",
      expect.objectContaining({ method: "DELETE" }),
    );

    expect(result).toBeNull();
  });

  it("toggles status with PATCH", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    const { togglePlaceStatus } = await loadApi();
    await togglePlaceStatus(3);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/user-places/3/status",
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  it("toggles favorite with PATCH", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    const { togglePlaceFavorite } = await loadApi();
    await togglePlaceFavorite(3);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/user-places/3/favorite",
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  it("updates place meta with PATCH and payload", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    const { updatePlaceMeta } = await loadApi();
    await updatePlaceMeta(2, { notes: "test" });

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/user-places/2",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ meta: { notes: "test" } }),
      }),
    );
  });

  it("throws error on failed request", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: "Bad request" }),
    });

    const { fetchUserPlaces } = await loadApi();
    await expect(fetchUserPlaces()).rejects.toThrow("Bad request");
  });
});
