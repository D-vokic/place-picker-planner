import { useState, useEffect, useMemo } from "react";
import PlacesList from "../components/PlacesList.jsx";
import ErrorPage from "../components/ErrorPage.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";
import SearchInput from "../components/SearchInput.jsx";
import { fetchPlaces } from "../utils/api.js";
import { sortPlacesByDistance } from "../loc.js";

export default function AvailablePlacesView({ onSelectPlace }) {
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
      setError(null);

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
      } catch (err) {
        setError(err?.message || "Failed to load places");
      } finally {
        setIsFetching(false);
      }
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
    <>
      <SearchInput value={searchTerm} onChange={setSearchTerm} />

      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onChange={setSelectedCategory}
      />

      <section className="places-category">
        <h2>Available Places</h2>

        {isFetching && (
          <p className="fallback-text" aria-busy="true">
            Fetching places...
          </p>
        )}

        {!isFetching && processedPlaces.length === 0 && (
          <p className="fallback-text">No places match your search.</p>
        )}

        {!isFetching && processedPlaces.length > 0 && (
          <PlacesList
            places={processedPlaces}
            onSelectPlace={onSelectPlace}
            disabled={isFetching}
            showMapPreview={true}
            recentlyAddedPlaceId={null}
          />
        )}
      </section>
    </>
  );
}
