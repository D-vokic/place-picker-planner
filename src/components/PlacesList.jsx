import PlaceItem from "./PlaceItem.jsx";

export default function PlacesList({ places, onSelectPlace, onToggleStatus }) {
  return (
    <ul className="places">
      {places.map((place) => (
        <PlaceItem
          key={place.id}
          place={place}
          onSelectPlace={onSelectPlace}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </ul>
  );
}
