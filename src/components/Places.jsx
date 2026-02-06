import PlacesList from "./PlacesList.jsx";

const MAP_PREVIEW_ENABLED = true;

export default function Places({
  title,
  places,
  fallbackText,
  onSelectPlace,
  onToggleStatus,
  onToggleFavorite,
  favoriteOnly,
  setFavoriteOnly,
  recentlyAddedPlaceId,
  isLoading = false,
  loadingText = "Loading...",
}) {
  const hasPlaces = places.length > 0;

  return (
    <section
      className="places-category"
      data-testid={title === "My Places" ? "my-places" : undefined}
    >
      <div className="places-header">
        <h2>{title}</h2>
        {typeof setFavoriteOnly === "function" && (
          <button
            className={`fav-filter-btn ${favoriteOnly ? "active" : ""}`}
            onClick={() => setFavoriteOnly(!favoriteOnly)}
            aria-pressed={favoriteOnly}
          >
            {favoriteOnly ? "⭐ Favorites" : "☆ Favorites"}
          </button>
        )}
      </div>

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
          onToggleFavorite={onToggleFavorite}
          disabled={isLoading}
          showMapPreview={MAP_PREVIEW_ENABLED}
          recentlyAddedPlaceId={recentlyAddedPlaceId}
        />
      )}
    </section>
  );
}
