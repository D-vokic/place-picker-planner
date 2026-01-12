import PlaceItem from "./PlaceItem.jsx";

export default function PlacesList({
  places,
  onSelectPlace,
  onToggleStatus,
  onToggleFavorite,
  showMapPreview,
  disabled,
  recentlyAddedPlaceId,
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
          showMapPreview={showMapPreview}
          disabled={disabled}
          highlight={recentlyAddedPlaceId === place.id}
        />
      ))}
    </ul>
  );
}
