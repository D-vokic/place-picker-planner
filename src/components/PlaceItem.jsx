export default function PlaceItem({
  place,
  onSelectPlace,
  onToggleStatus,
  onToggleFavorite,
  onOpenNotes,
  showMapPreview,
  disabled,
  highlight,
}) {
  const hasCoordinates =
    typeof place.lat === "number" && typeof place.lon === "number";

  const isFavorite = Boolean(place.isFavorite);
  const plannedDate = place.meta?.plannedDate;
  const hasNotes = place.meta?.notes;

  return (
    <li className={`place-item ${highlight ? "highlight" : ""}`}>
      <div className="place-header">
        <button
          type="button"
          className="place-image"
          onClick={
            typeof onSelectPlace === "function"
              ? () => onSelectPlace(place)
              : undefined
          }
          disabled={disabled}
          aria-label={`Select ${place.title}`}
        >
          <img src={place.imageUrl} alt={place.imageAlt} />
        </button>

        {onToggleFavorite && (
          <button
            type="button"
            className={`favorite-toggle ${isFavorite ? "active" : ""}`}
            onClick={() => onToggleFavorite(place.id)}
            disabled={disabled}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? `Remove ${place.title} from favorites`
                : `Add ${place.title} to favorites`
            }
          >
            {isFavorite ? "★" : "☆"}
          </button>
        )}
      </div>

      {showMapPreview && place.isNearest && hasCoordinates && (
        <div className="map-preview">
          <iframe
            title={`Map preview of ${place.title}`}
            width="100%"
            height="150"
            loading="lazy"
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
          type="button"
          className="status-toggle"
          onClick={() => onToggleStatus(place.id)}
          disabled={disabled}
          aria-label={`Mark ${place.title} as ${
            place.status === "visited" ? "want to visit" : "visited"
          }`}
        >
          {place.status === "visited" ? "Visited" : "Want to visit"}
        </button>
      )}

      {plannedDate && (
        <p className="planned-date" role="status">
          Planned: {plannedDate}
        </p>
      )}

      {onOpenNotes && (
        <button
          type="button"
          className="notes-btn"
          onClick={() => onOpenNotes(place)}
          disabled={disabled}
          aria-label={`Open notes for ${place.title}`}
        >
          Notes{hasNotes ? "*" : ""}
        </button>
      )}
    </li>
  );
}
