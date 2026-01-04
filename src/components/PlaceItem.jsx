export default function PlaceItem({ place, onSelectPlace }) {
  return (
    <li className="place-item">
      <button onClick={() => onSelectPlace(place)}>
        <img src={place.imageUrl} alt={place.imageAlt} />
        <h3>{place.title}</h3>
      </button>
    </li>
  );
}
