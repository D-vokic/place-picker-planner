// import PlacesList from "../components/PlacesList.jsx";

// const MAP_PREVIEW_ENABLED = true;

// export default function MyPlacesView({
//   places,
//   isLoading,
//   onSelectPlace,
//   onToggleStatus,
//   onToggleFavorite,
//   onOpenNotes,
//   favoriteOnly,
//   setFavoriteOnly,
//   recentlyAddedPlaceId,
// }) {
//   const hasPlaces = places.length > 0;

//   return (
//     <section className="places-category">
//       <div className="places-header">
//         <h2>My Places</h2>
//         <button
//           className={`fav-filter-btn ${favoriteOnly ? "active" : ""}`}
//           onClick={() => setFavoriteOnly(!favoriteOnly)}
//         >
//           {favoriteOnly ? "⭐ Favorites" : "☆ Favorites"}
//         </button>
//       </div>

//       {isLoading && <p className="fallback-text">Loading your places...</p>}

//       {!isLoading && !hasPlaces && (
//         <p className="fallback-text">You have not added any places yet.</p>
//       )}

//       {!isLoading && hasPlaces && (
//         <PlacesList
//           places={places}
//           onSelectPlace={onSelectPlace}
//           onToggleStatus={onToggleStatus}
//           onToggleFavorite={onToggleFavorite}
//           onOpenNotes={onOpenNotes}
//           disabled={isLoading}
//           showMapPreview={MAP_PREVIEW_ENABLED}
//           recentlyAddedPlaceId={recentlyAddedPlaceId}
//         />
//       )}
//     </section>
//   );
// }

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
    <section className="places-category">
      <div className="places-header">
        <h2>My Places</h2>
        <button
          className={`fav-filter-btn ${favoriteOnly ? "active" : ""}`}
          onClick={() => setFavoriteOnly(!favoriteOnly)}
        >
          {favoriteOnly ? "⭐ Favorites" : "☆ Favorites"}
        </button>
      </div>

      {isLoading && <p className="fallback-text">Loading your places...</p>}

      {!isLoading && !hasAnyPlaces && (
        <p className="fallback-text">You have not added any places yet.</p>
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
