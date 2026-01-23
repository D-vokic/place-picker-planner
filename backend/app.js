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

function getUserPlacesFile(req) {
  return `user-places-${req.user.id}.json`;
}

async function readJSON(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
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
    const places = await readJSON(getUserPlacesFile(req));
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
    const fileName = getUserPlacesFile(req);
    const userPlaces = await readJSON(fileName);

    if (userPlaces.some((p) => p.id === place.id)) {
      return res.status(409).json({ message: "Place already added." });
    }

    const placeToStore = {
      ...place,
      status: "want",
      isFavorite: false,
    };

    userPlaces.unshift(placeToStore);
    await writeJSON(fileName, userPlaces);

    res.status(201).json({ place: placeToStore });
  } catch {
    res.status(500).json({ message: "Failed to save place." });
  }
});

app.patch("/user-places/:id/status", async (req, res) => {
  const placeId = req.params.id;

  try {
    const fileName = getUserPlacesFile(req);
    const userPlaces = await readJSON(fileName);
    const place = userPlaces.find((p) => p.id === placeId);

    if (!place) {
      return res.status(404).json({ message: "Place not found." });
    }

    place.status = place.status === "visited" ? "want" : "visited";

    await writeJSON(fileName, userPlaces);
    res.json({ place });
  } catch {
    res.status(500).json({ message: "Failed to update place status." });
  }
});

app.patch("/user-places/:id/favorite", async (req, res) => {
  const placeId = req.params.id;

  try {
    const fileName = getUserPlacesFile(req);
    const userPlaces = await readJSON(fileName);
    const place = userPlaces.find((p) => p.id === placeId);

    if (!place) {
      return res.status(404).json({ message: "Place not found." });
    }

    place.isFavorite = !place.isFavorite;

    await writeJSON(fileName, userPlaces);
    res.json({ place });
  } catch {
    res.status(500).json({ message: "Failed to toggle favorite." });
  }
});

app.patch("/user-places/:id", async (req, res) => {
  const placeId = req.params.id;
  const { meta } = req.body;

  try {
    const fileName = getUserPlacesFile(req);
    const userPlaces = await readJSON(fileName);
    const place = userPlaces.find((p) => p.id === placeId);

    if (!place) {
      return res.status(404).json({ message: "Place not found." });
    }

    place.meta = {
      ...(place.meta || {}),
      ...(meta || {}),
    };

    await writeJSON(fileName, userPlaces);
    res.json({ place });
  } catch {
    res.status(500).json({ message: "Failed to update place meta." });
  }
});

app.delete("/user-places/:id", async (req, res) => {
  const placeId = req.params.id;

  try {
    const fileName = getUserPlacesFile(req);
    const userPlaces = await readJSON(fileName);
    const updatedPlaces = userPlaces.filter((p) => p.id !== placeId);

    await writeJSON(fileName, updatedPlaces);
    res.json({ message: "Place removed." });
  } catch {
    res.status(500).json({ message: "Failed to remove place." });
  }
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
