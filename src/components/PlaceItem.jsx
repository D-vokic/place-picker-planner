export default function PlaceItem({
  place,
  onSelectPlace,
  onToggleStatus,
  onToggleFavorite,
  showMapPreview,
  disabled,
}) {
  const hasLocation =
    typeof place.lat === "number" && typeof place.lon === "number";

  const isFavorite = Boolean(place.isFavorite);

  return (
    <li className="place-item">
      <div className="place-header">
        <button
          className="place-image"
          onClick={() => onSelectPlace(place)}
          aria-label={`Select ${place.title}`}
          disabled={disabled}
        >
          <img src={place.imageUrl} alt={place.imageAlt} />
        </button>

        {onToggleFavorite && (
          <button
            className={`favorite-toggle ${isFavorite ? "active" : ""}`}
            onClick={() => onToggleFavorite(place.id)}
            aria-pressed={isFavorite}
            aria-label={`${isFavorite ? "Remove from" : "Add to"} favorites`}
            disabled={disabled}
          >
            {isFavorite ? "★" : "☆"}
          </button>
        )}
      </div>

      {showMapPreview && place.isNearest && hasLocation && (
        <div className="map-preview">
          <iframe
            title={`Map preview of ${place.title}`}
            width="100%"
            height="150"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${
              place.lon - 0.01
            }%2C${place.lat - 0.01}%2C${place.lon + 0.01}%2C${
              place.lat + 0.01
            }&layer=mapnik&marker=${place.lat}%2C${place.lon}`}
          />
        </div>
      )}

      <h3 className="place-title">{place.title}</h3>

      {onToggleStatus && (
        <button
          className="status-toggle"
          onClick={() => onToggleStatus(place.id)}
          aria-pressed={place.status === "visited"}
          aria-label={`Mark ${place.title} as ${
            place.status === "visited" ? "want to visit" : "visited"
          }`}
          disabled={disabled}
        >
          {place.status === "visited" ? "Visited" : "Want to visit"}
        </button>
      )}
    </li>
  );
}
