import express from "express";
import path from "path";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import createUserPlacesRepository from "./data/userPlacesRepository.js";

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

await db.exec(`
  CREATE TABLE IF NOT EXISTS places (
    id TEXT PRIMARY KEY,
    data TEXT
  );
`);

await db.exec(`
  CREATE TABLE IF NOT EXISTS collections (
    id TEXT,
    user_id TEXT,
    title TEXT,
    PRIMARY KEY (id, user_id)
  );
`);

await db.exec(`
  CREATE TABLE IF NOT EXISTS user_places (
    id TEXT,
    user_id TEXT,
    collection_id TEXT,
    data TEXT,
    PRIMARY KEY (id, user_id, collection_id)
  );
`);

async function ensureDefaultCollection() {
  const rows = await db.all("SELECT DISTINCT user_id FROM user_places");
  for (const row of rows) {
    await db.run(
      "INSERT OR IGNORE INTO collections (id, user_id, title) VALUES (?, ?, ?)",
      "default",
      row.user_id,
      "My Places",
    );

    await db.run(
      "UPDATE user_places SET collection_id = ? WHERE collection_id IS NULL AND user_id = ?",
      "default",
      row.user_id,
    );
  }
}

await ensureDefaultCollection();

const userPlacesRepo = createUserPlacesRepository(db);

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

app.get("/collections", async (req, res) => {
  const rows = await db.all(
    "SELECT id, title FROM collections WHERE user_id = ?",
    req.user.id,
  );
  res.json({ collections: rows });
});

app.get("/collections/:collectionId/places", async (req, res) => {
  const places = await userPlacesRepo.getAllByUserAndCollection(
    req.user.id,
    req.params.collectionId,
  );
  res.json({ places });
});

app.post("/collections/:collectionId/places", async (req, res) => {
  const place = req.body.place;
  if (!place || !place.id) {
    return res.status(400).json({ message: "Invalid place data." });
  }

  const stored = await userPlacesRepo.add(
    req.user.id,
    req.params.collectionId,
    place,
  );

  res.status(201).json({ place: stored });
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
