import { useState, useEffect, useMemo } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./ErrorPage.jsx";
import CategoryFilter from "./CategoryFilter.jsx";
import SearchInput from "./SearchInput.jsx";
import { fetchPlaces } from "../utils/api.js";
import { sortPlacesByDistance } from "../loc.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        setUserLocation(null);
      },
    );
  }, []);

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
          lat: place.lat,
          lon: place.lon,
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

  const processedPlaces = useMemo(() => {
    let result = [...availablePlaces];

    if (userLocation) {
      result = sortPlacesByDistance(result, userLocation.lat, userLocation.lon);
    }

    result = result.filter((place) => {
      const matchesCategory =
        selectedCategory === "all" || place.category === selectedCategory;

      const matchesSearch = place.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (result.length > 0 && userLocation) {
      result = result.map((place, index) => ({
        ...place,
        isNearest: index === 0,
      }));
    }

    return result;
  }, [availablePlaces, selectedCategory, searchTerm, userLocation]);

  return (
    <section data-testid="available-places">
      <SearchInput value={searchTerm} onChange={setSearchTerm} />

      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onChange={setSelectedCategory}
      />

      <Places
        title="Available Places"
        places={processedPlaces}
        isLoading={isFetching}
        loadingText="Fetching places..."
        fallbackText="No places match your search."
        onSelectPlace={onSelectPlace}
      />
    </section>
  );
}
