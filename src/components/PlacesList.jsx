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
      {places.map((place, index) => (
        <PlaceItem
          key={`${place.id}-${index}`}
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
