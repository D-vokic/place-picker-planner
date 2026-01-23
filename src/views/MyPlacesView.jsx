import PlacesList from "../components/PlacesList.jsx";

const MAP_PREVIEW_ENABLED = true;

export default function MyPlacesView({
  places,
  isLoading,
  onSelectPlace,
  onToggleStatus,
  onToggleFavorite,
  onOpenNotes,
  favoriteOnly,
  setFavoriteOnly,
  recentlyAddedPlaceId,
}) {
  const hasAnyPlaces = places.length > 0;

  return (
    <section className="places-category" aria-busy={isLoading}>
      <div className="places-header">
        <h2>My Places</h2>
        <button
          type="button"
          className={`fav-filter-btn ${favoriteOnly ? "active" : ""}`}
          onClick={() => setFavoriteOnly(!favoriteOnly)}
          aria-pressed={favoriteOnly}
          disabled={isLoading}
        >
          {favoriteOnly ? "⭐ Favorites" : "☆ Favorites"}
        </button>
      </div>

      {isLoading && (
        <p className="fallback-text" role="status">
          Loading your places…
        </p>
      )}

      {!isLoading && !hasAnyPlaces && (
        <p className="fallback-text">
          No places yet. Add one from the list below.
        </p>
      )}

      {!isLoading && hasAnyPlaces && (
        <PlacesList
          places={places}
          onSelectPlace={onSelectPlace}
          onToggleStatus={onToggleStatus}
          onToggleFavorite={onToggleFavorite}
          onOpenNotes={onOpenNotes}
          disabled={isLoading}
          showMapPreview={MAP_PREVIEW_ENABLED}
          recentlyAddedPlaceId={recentlyAddedPlaceId}
        />
      )}
    </section>
  );
}
