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
  CREATE TABLE IF NOT EXISTS user_places (
    id TEXT,
    user_id TEXT,
    data TEXT,
    PRIMARY KEY (id, user_id)
  );
`);

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

  req.user = {
    id: userId,
    role: "user",
    isAuthenticated: true,
  };

  next();
}

app.use(authMiddleware);

app.get("/places", async (req, res) => {
  const rows = await db.all("SELECT data FROM places");
  const places = rows.map((r) => JSON.parse(r.data));
  res.json({ places });
});

app.get("/user-places", async (req, res) => {
  const places = await userPlacesRepo.getAllByUser(req.user.id);
  res.json({ places });
});

app.post("/user-places", async (req, res) => {
  const place = req.body.place;

  if (!place || !place.id) {
    return res.status(400).json({ message: "Invalid place data." });
  }

  const stored = await userPlacesRepo.add(req.user.id, place);
  res.status(201).json({ place: stored });
});

app.patch("/user-places/:id/status", async (req, res) => {
  const place = await userPlacesRepo.getById(req.user.id, req.params.id);

  if (!place) {
    return res.status(404).json({ message: "Place not found." });
  }

  place.status = place.status === "visited" ? "want" : "visited";
  await userPlacesRepo.update(req.user.id, req.params.id, place);

  res.json({ place });
});

app.patch("/user-places/:id/favorite", async (req, res) => {
  const place = await userPlacesRepo.getById(req.user.id, req.params.id);

  if (!place) {
    return res.status(404).json({ message: "Place not found." });
  }

  place.isFavorite = !place.isFavorite;
  await userPlacesRepo.update(req.user.id, req.params.id, place);

  res.json({ place });
});

app.patch("/user-places/:id", async (req, res) => {
  const place = await userPlacesRepo.getById(req.user.id, req.params.id);

  if (!place) {
    return res.status(404).json({ message: "Place not found." });
  }

  place.meta = {
    ...(place.meta || {}),
    ...(req.body.meta || {}),
  };

  await userPlacesRepo.update(req.user.id, req.params.id, place);
  res.json({ place });
});

app.delete("/user-places/:id", async (req, res) => {
  await userPlacesRepo.remove(req.user.id, req.params.id);
  res.json({ message: "Place removed." });
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
