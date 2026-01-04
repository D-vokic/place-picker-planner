import { useState, useEffect, useMemo } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./ErrorPage.jsx";
import CategoryFilter from "./CategoryFilter.jsx";
import { fetchPlaces } from "../utils/api.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  const categories = useMemo(() => {
    return Array.from(new Set(availablePlaces.map((place) => place.category)));
  }, [availablePlaces]);

  const filteredPlaces =
    selectedCategory === "all"
      ? availablePlaces
      : availablePlaces.filter((place) => place.category === selectedCategory);

  return (
    <>
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onChange={setSelectedCategory}
      />

      <Places
        title="Available Places"
        places={filteredPlaces}
        isLoading={isFetching}
        loadingText="Fetching places..."
        fallbackText="No places available."
        onSelectPlace={onSelectPlace}
      />
    </>
  );
}
