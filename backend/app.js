import express from "express";
import path from "path";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(process.cwd(), "data");
const IMAGES_DIR = path.join(process.cwd(), "images");

app.use("/images", express.static(IMAGES_DIR));

const db = await open({
  filename: path.join(DATA_DIR, "app.db"),
  driver: sqlite3.Database,
});

/* ===== SCHEMA ===== */

await db.exec(`
  CREATE TABLE IF NOT EXISTS places (
    id TEXT PRIMARY KEY,
    data TEXT
  );
`);

await db.exec(`
  CREATE TABLE IF NOT EXISTS user_places (
    user_id TEXT,
    collection_id TEXT,
    data TEXT
  );
`);

/* ===== AUTH ===== */

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization required." });
  }
  const [, userId] = authHeader.split(" ");
  if (!userId) {
    return res.status(401).json({ message: "Invalid authorization header." });
  }
  req.user = { id: userId };
  next();
}

app.use(authMiddleware);

/* ===== STABLE V1 ENDPOINTS ===== */

app.get("/places", async (req, res) => {
  const rows = await db.all("SELECT data FROM places");
  res.json({ places: rows.map((r) => JSON.parse(r.data)) });
});

app.get("/user-places", async (req, res) => {
  const rows = await db.all(
    `SELECT data FROM user_places
     WHERE user_id = ?`,
    req.user.id,
  );
  res.json({ places: rows.map((r) => JSON.parse(r.data)) });
});

app.post("/user-places", async (req, res) => {
  const place = req.body.place;
  if (!place?.id) {
    return res.status(400).json({ message: "Invalid place data." });
  }

  await db.run(
    `INSERT INTO user_places (user_id, collection_id, data)
     VALUES (?, ?, ?)`,
    req.user.id,
    "default",
    JSON.stringify({
      ...place,
      status: "want",
      isFavorite: false,
      meta: place.meta ?? {},
    }),
  );

  res.status(201).json({ place });
});

app.patch("/user-places/:id/status", async (req, res) => {
  const row = await db.get(
    `SELECT rowid, data FROM user_places
   WHERE user_id = ?
     AND json_extract(data, '$.id') = ?`,
    req.user.id,
    req.params.id,
  );

  if (!row) {
    return res.status(404).json({ message: "Place not found." });
  }

  const place = JSON.parse(row.data);
  place.status = place.status === "visited" ? "want" : "visited";

  await db.run(
    `UPDATE user_places
     SET data = ?
     WHERE rowid = ?`,
    JSON.stringify(place),
    row.rowid,
  );

  res.json({ place });
});

app.patch("/user-places/:id", async (req, res) => {
  const row = await db.get(
    `SELECT rowid, data FROM user_places
     WHERE user_id = ?
       AND json_extract(data, '$.id') = ?`,
    req.user.id,
    req.params.id,
  );

  if (!row) {
    return res.status(404).json({ message: "Place not found." });
  }

  const place = JSON.parse(row.data);
  place.meta = {
    ...(place.meta || {}),
    ...(req.body.meta || {}),
  };

  await db.run(
    `UPDATE user_places
     SET data = ?
     WHERE rowid = ?`,
    JSON.stringify(place),
    row.rowid,
  );

  res.json({ place });
});

app.patch("/user-places/:id/favorite", async (req, res) => {
  const row = await db.get(
    `SELECT rowid, data FROM user_places
     WHERE user_id = ?
       AND json_extract(data, '$.id') = ?`,
    req.user.id,
    req.params.id,
  );

  if (!row) {
    return res.status(404).json({ message: "Place not found." });
  }

  const place = JSON.parse(row.data);
  place.isFavorite = !place.isFavorite;

  await db.run(
    `UPDATE user_places
     SET data = ?
     WHERE rowid = ?`,
    JSON.stringify(place),
    row.rowid,
  );

  res.json({ place });
});

app.delete("/user-places/:id", async (req, res) => {
  await db.run(
    `DELETE FROM user_places
     WHERE user_id = ?
       AND json_extract(data, '$.id') = ?`,
    req.user.id,
    req.params.id,
  );

  res.json({ message: "Place removed." });
});

/* ===== V2 ALIAS (NO BREAKAGE) ===== */

app.patch(
  "/collections/:collectionId/places/:placeId/status",
  async (req, res) => {
    req.params.id = req.params.placeId;
    return app._router.handle(req, res, () => {});
  },
);

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
