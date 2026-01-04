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

async function readJSON(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

async function writeJSON(fileName, data) {
  const filePath = path.join(DATA_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

app.get("/places", async (req, res) => {
  try {
    const places = await readJSON("places.json");
    res.json({ places });
  } catch {
    res.status(500).json({ message: "Failed to load places." });
  }
});

app.get("/user-places", async (req, res) => {
  try {
    const places = await readJSON("user-places.json");
    res.json({ places });
  } catch {
    res.status(500).json({ message: "Failed to load user places." });
  }
});

app.post("/user-places", async (req, res) => {
  const place = req.body.place;

  if (!place || !place.id) {
    return res.status(400).json({ message: "Invalid place data." });
  }

  try {
    const userPlaces = await readJSON("user-places.json");

    if (userPlaces.some((p) => p.id === place.id)) {
      return res.status(409).json({ message: "Place already added." });
    }

    const placeToStore = {
      ...place,
      status: place.status || "want",
    };

    userPlaces.unshift(placeToStore);
    await writeJSON("user-places.json", userPlaces);

    res.status(201).json({ place: placeToStore });
  } catch {
    res.status(500).json({ message: "Failed to save place." });
  }
});

// TOGGLE status (want <-> visited)
app.patch("/user-places/:id", async (req, res) => {
  const placeId = req.params.id;

  try {
    const userPlaces = await readJSON("user-places.json");
    const place = userPlaces.find((p) => p.id === placeId);

    if (!place) {
      return res.status(404).json({ message: "Place not found." });
    }

    place.status = place.status === "visited" ? "want" : "visited";

    await writeJSON("user-places.json", userPlaces);
    res.json({ place });
  } catch {
    res.status(500).json({ message: "Failed to update place status." });
  }
});

app.delete("/user-places/:id", async (req, res) => {
  const placeId = req.params.id;

  try {
    const userPlaces = await readJSON("user-places.json");
    const updatedPlaces = userPlaces.filter((p) => p.id !== placeId);

    await writeJSON("user-places.json", updatedPlaces);
    res.json({ message: "Place removed." });
  } catch {
    res.status(500).json({ message: "Failed to remove place." });
  }
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
