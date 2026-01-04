import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./ErrorPage.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const response = await fetch("http://localhost:3000/places");

        if (!response.ok) {
          throw new Error("Failed to fetch places.");
        }

        const resData = await response.json();

        const normalizedPlaces = resData.places.map((place) => ({
          id: place.id,
          title: place.title,
          imageUrl: `http://localhost:3000/${place.image.src}`,
          imageAlt: place.image.alt || place.title,
          city: place.city || "",
          category: place.category || "general",
          status: "available",
        }));

        setAvailablePlaces(normalizedPlaces);
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch places. Please try again later.",
        });
      }

      setIsFetching(false);
    }

    fetchPlaces();
  }, []);

  if (error) {
    return <ErrorPage title="An error occurred" message={error.message} />;
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
