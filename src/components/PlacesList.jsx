// import PlaceItem from "./PlaceItem.jsx";

// export default function PlacesList({
//   places,
//   onSelectPlace,
//   onToggleStatus,
//   onToggleFavorite,
//   onOpenNotes,
//   showMapPreview,
//   disabled,
//   recentlyAddedPlaceId,
// }) {
//   return (
//     <ul className="places">
//       {places.map((place) => (
//         <PlaceItem
//           key={place.id}
//           place={place}
//           onSelectPlace={onSelectPlace}
//           onToggleStatus={onToggleStatus}
//           onToggleFavorite={onToggleFavorite}
//           onOpenNotes={onOpenNotes}
//           showMapPreview={showMapPreview}
//           disabled={disabled}
//           highlight={recentlyAddedPlaceId === place.id}
//         />
//       ))}
//     </ul>
//   );
// }

import PlaceItem from "./PlaceItem.jsx";

export default function PlacesList({
  places,
  onSelectPlace,
  onToggleStatus,
  onToggleFavorite,
  onOpenNotes,
  showMapPreview,
  disabled,
  highlightedPlaceId,
}) {
  return (
    <ul className="places">
      {places.map((place) => (
        <PlaceItem
          key={place.id}
          place={place}
          onSelectPlace={onSelectPlace}
          onToggleStatus={onToggleStatus}
          onToggleFavorite={onToggleFavorite}
          onOpenNotes={onOpenNotes}
          showMapPreview={showMapPreview}
          disabled={disabled}
          highlight={highlightedPlaceId === place.id}
        />
      ))}
    </ul>
  );
}
