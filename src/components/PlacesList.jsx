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
    <ul className="places" aria-live="polite" aria-disabled={disabled}>
      {places.map((place, index) => (
        <PlaceItem
          key={`${place.id}-${place.status}-${index}`}
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
