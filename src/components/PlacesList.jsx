import PlaceItem from "./PlaceItem.jsx";

export default function PlacesList({
  places,
  onSelectPlace,
  onToggleStatus,
  showMapPreview,
  disabled,
}) {
  return (
    <ul className="places">
      {places.map((place) => (
        <PlaceItem
          key={place.id}
          place={place}
          onSelectPlace={onSelectPlace}
          onToggleStatus={onToggleStatus}
          showMapPreview={showMapPreview}
          disabled={disabled}
        />
      ))}
    </ul>
  );
}
