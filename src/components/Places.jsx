import PlacesList from "./PlacesList.jsx";

export default function Places({
  title,
  places,
  fallbackText,
  onSelectPlace,
  isLoading = false,
  loadingText = "Loading...",
}) {
  return (
    <section className="places-category">
      <h2>{title}</h2>

      {isLoading && <p className="fallback-text">{loadingText}</p>}

      {!isLoading && places.length === 0 && (
        <p className="fallback-text">{fallbackText}</p>
      )}

      {!isLoading && places.length > 0 && (
        <PlacesList places={places} onSelectPlace={onSelectPlace} />
      )}
    </section>
  );
}
