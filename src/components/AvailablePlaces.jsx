import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./ErrorPage.jsx";
import { fetchPlaces } from "../utils/api.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPlaces() {
      setIsFetching(true);

      try {
        const data = await fetchPlaces();

        const normalizedPlaces = data.places.map((place) => ({
          id: place.id,
          title: place.title,
          imageUrl: `http://localhost:3000/images/${place.image.src}`,
          imageAlt: place.image.alt || place.title,
          city: place.city || "",
          category: place.category || "general",
          status: "available",
        }));

        setAvailablePlaces(normalizedPlaces);
      } catch (error) {
        setError(error.message);
      }

      setIsFetching(false);
    }

    loadPlaces();
  }, []);

  if (error) {
    return <ErrorPage title="Failed to load places" message={error} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching places..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
