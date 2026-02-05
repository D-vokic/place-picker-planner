import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import fs from "fs";
import path from "path";

let app;

beforeAll(async () => {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const mod = await import("./app.js");
  app = mod.default ?? mod.app;
});

const AUTH_HEADER = { Authorization: "Bearer test-user" };

describe("API integration tests", () => {
  const placeId = "rome-1";

  it("GET /places returns list", async () => {
    const res = await request(app).get("/places").set(AUTH_HEADER);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.places)).toBe(true);
  });

  it("POST /user-places adds a place", async () => {
    const res = await request(app)
      .post("/user-places")
      .set(AUTH_HEADER)
      .send({
        place: {
          id: placeId,
          title: "Rome",
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.place.id).toBe(placeId);
  });

  it("GET /user-places returns user places", async () => {
    const res = await request(app).get("/user-places").set(AUTH_HEADER);
    expect(res.status).toBe(200);
    expect(res.body.places.length).toBeGreaterThan(0);
  });

  it("PATCH /user-places/:id/status toggles status", async () => {
    const res = await request(app)
      .patch(`/user-places/${placeId}/status`)
      .set(AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(["want", "visited"]).toContain(res.body.place.status);
  });

  it("PATCH /user-places/:id/favorite toggles favorite", async () => {
    const res = await request(app)
      .patch(`/user-places/${placeId}/favorite`)
      .set(AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(typeof res.body.place.isFavorite).toBe("boolean");
  });

  it("PATCH /user-places/:id updates meta", async () => {
    const res = await request(app)
      .patch(`/user-places/${placeId}`)
      .set(AUTH_HEADER)
      .send({ meta: { notes: "integration test" } });

    expect(res.status).toBe(200);
    expect(res.body.place.meta.notes).toBe("integration test");
  });

  it("DELETE /user-places/:id removes place", async () => {
    const res = await request(app)
      .delete(`/user-places/${placeId}`)
      .set(AUTH_HEADER);

    expect(res.status).toBe(200);
  });
});
