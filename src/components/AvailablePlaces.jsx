import Places from "./Places.jsx";
import { useState, useEffect } from "react";
import ErrorPage from "./ErrorPage.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  // TODO: Fetching available places from backend API, and handling errors
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const response = await fetch("http://localhost:3000/places");

        if (!response.ok) {
          throw new Error("Failed to fetch places!");
        }
        const resData = await response.json();

        setAvailablePlaces(resData.places);
      } catch (error) {
        // handle the error
        setError({
          message:
            error.message || "Could not fetch places, please try again later.",
        });
      }

      setIsFetching(false);
    }

    fetchPlaces();
  }, []);

  if (error) {
    return <ErrorPage title="An error occured!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
