import PlacesList from "./PlacesList.jsx";

export default function Places({
  title,
  places,
  fallbackText,
  onSelectPlace,
  onToggleStatus,
  isLoading = false,
  loadingText = "Loading...",
}) {
  const hasPlaces = places.length > 0;

  return (
    <section className="places-category">
      <h2>{title}</h2>

      {isLoading && (
        <p className="fallback-text" aria-busy="true">
          {loadingText}
        </p>
      )}

      {!isLoading && !hasPlaces && (
        <p className="fallback-text">{fallbackText}</p>
      )}

      {!isLoading && hasPlaces && (
        <PlacesList
          places={places}
          onSelectPlace={onSelectPlace}
          onToggleStatus={onToggleStatus}
          disabled={isLoading}
        />
      )}
    </section>
  );
}
