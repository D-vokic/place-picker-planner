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
  const isFavorite = place.isFavorite === true;
  const plannedDate = place.meta?.plannedDate;
  const hasNotes = Boolean(place.meta?.notes);

  return (
    <li
      className={`place-item ${highlight ? "highlight" : ""}`}
      data-testid="place-item"
    >
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
          data-testid="add-place"
        >
          <img src={place.imageUrl} alt={place.imageAlt} />
        </button>

        <button
          type="button"
          className={`favorite-toggle ${isFavorite ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (typeof onToggleFavorite === "function") {
              onToggleFavorite(place.id);
            }
          }}
          disabled={disabled}
          data-testid="toggle-favorite"
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>

      <h3 className="place-title">{place.title}</h3>

      {place.city && <p className="place-city">{place.city}</p>}

      <div className="place-actions">
        <button
          type="button"
          className="status-toggle"
          onClick={() => {
            if (typeof onToggleStatus === "function") {
              onToggleStatus(place.id);
            }
          }}
          disabled={disabled}
          data-testid="toggle-status"
        >
          {place.status === "visited" ? "Visited" : "Want to visit"}
        </button>

        <button
          type="button"
          className="notes-btn"
          onClick={() => {
            if (typeof onOpenNotes === "function") {
              onOpenNotes(place);
            }
          }}
          disabled={disabled}
        >
          Notes{hasNotes ? "*" : ""}
        </button>

        <button
          type="button"
          className="delete-btn"
          onClick={() => {
            if (typeof onSelectPlace === "function") {
              onSelectPlace(place);
            }
          }}
          disabled={disabled}
          data-testid="delete-place"
        >
          Delete
        </button>
      </div>

      {plannedDate && <p className="planned-date">Planned: {plannedDate}</p>}

      {showMapPreview && place.isNearest && place.lat && place.lon && (
        <div className="map-preview">
          <iframe
            title={`Map of ${place.title}`}
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
    </li>
  );
}
