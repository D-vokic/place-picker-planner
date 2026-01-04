import express from "express";
import fs from "fs/promises";
import path from "path";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(process.cwd(), "data");
const IMAGES_DIR = path.join(process.cwd(), "images");

app.use("/images", express.static(IMAGES_DIR));

/* -------------------- helpers -------------------- */

async function readJSON(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

async function writeJSON(fileName, data) {
  const filePath = path.join(DATA_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

/* -------------------- routes -------------------- */

// GET all available places
app.get("/places", async (req, res) => {
  try {
    const data = await readJSON("places.json");
    res.json({ places: data });
  } catch {
    res.status(500).json({ message: "Failed to load places." });
  }
});

// GET user places
app.get("/user-places", async (req, res) => {
  try {
    const data = await readJSON("user-places.json");
    res.json({ places: data });
  } catch {
    res.status(500).json({ message: "Failed to load user places." });
  }
});

// ADD place to user places
app.post("/user-places", async (req, res) => {
  const place = req.body.place;

  if (!place || !place.id) {
    return res.status(400).json({ message: "Invalid place data." });
  }

  try {
    const userPlaces = await readJSON("user-places.json");

    const alreadyAdded = userPlaces.some((p) => p.id === place.id);
    if (alreadyAdded) {
      return res.status(409).json({ message: "Place already added." });
    }

    userPlaces.unshift(place);
    await writeJSON("user-places.json", userPlaces);

    res.status(201).json({ place });
  } catch {
    res.status(500).json({ message: "Failed to save place." });
  }
});

// REMOVE place from user places
app.delete("/user-places/:id", async (req, res) => {
  const placeId = req.params.id;

  try {
    const userPlaces = await readJSON("user-places.json");
    const updatedPlaces = userPlaces.filter((place) => place.id !== placeId);

    await writeJSON("user-places.json", updatedPlaces);

    res.json({ message: "Place removed." });
  } catch {
    res.status(500).json({ message: "Failed to remove place." });
  }
});

/* -------------------- start server -------------------- */

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
