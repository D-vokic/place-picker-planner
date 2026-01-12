import PlacesList from "../components/PlacesList.jsx";

const MAP_PREVIEW_ENABLED = true;

export default function MyPlacesView({
  places,
  isLoading,
  onSelectPlace,
  onToggleStatus,
  onToggleFavorite,
  favoriteOnly,
  setFavoriteOnly,
  recentlyAddedPlaceId,
}) {
  const hasPlaces = places.length > 0;

  return (
    <section className="places-category">
      <div className="places-header">
        <h2>My Places</h2>
        <button
          className={`fav-filter-btn ${favoriteOnly ? "active" : ""}`}
          onClick={() => setFavoriteOnly(!favoriteOnly)}
          aria-pressed={favoriteOnly}
        >
          {favoriteOnly ? "⭐ Favorites" : "☆ Favorites"}
        </button>
      </div>

      {isLoading && (
        <p className="fallback-text" aria-busy="true">
          Loading your places...
        </p>
      )}

      {!isLoading && !hasPlaces && (
        <p className="fallback-text">You have not added any places yet.</p>
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
