export default function PlaceItem({ place, onSelectPlace, onToggleStatus }) {
  return (
    <li className="place-item">
      <button
        className="place-image"
        onClick={() => onSelectPlace(place)}
        aria-label={`Select ${place.title}`}
      >
        <img src={place.imageUrl} alt={place.imageAlt} />
      </button>

      <h3 className="place-title">{place.title}</h3>

      {onToggleStatus && (
        <button
          className="status-toggle"
          onClick={() => onToggleStatus(place.id)}
          aria-pressed={place.status === "visited"}
          aria-label={`Mark ${place.title} as ${
            place.status === "visited" ? "want to visit" : "visited"
          }`}
        >
          {place.status === "visited" ? "Visited" : "Want to visit"}
        </button>
      )}
    </li>
  );
}
