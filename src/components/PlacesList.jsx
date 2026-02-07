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
  const uniquePlaces = Array.from(
    new Map(places.map((place) => [place.id, place])).values(),
  );

  return (
    <ul className="places">
      {uniquePlaces.map((place) => (
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
          data-testid="place-item"
        />
      ))}
    </ul>
  );
}
