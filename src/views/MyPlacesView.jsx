import { useState } from "react";
import PlacesList from "../components/PlacesList.jsx";
import { exportCollection } from "../utils/api.js";

const MAP_PREVIEW_ENABLED = true;

export default function MyPlacesView({
  places,
  isLoading,
  onSelectPlace,
  onToggleStatus,
  onToggleFavorite,
  onOpenNotes,
  favoriteOnly,
  setFavoriteOnly,
  sortState,
  onToggleSortByStatus,
  onToggleSortByTitle,
  onToggleSortByPlannedDate,
  onToggleSortByCreatedAt,
  onResetFiltersAndSort,
  recentlyAddedPlaceId,
}) {
  const hasAnyPlaces = places.length > 0;
  const [exportStatus, setExportStatus] = useState(null);

  async function handleExportDownload() {
    try {
      setExportStatus("downloading");
      const data = await exportCollection();

      const blob = new Blob([JSON.stringify(data.places, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-places.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportStatus("downloaded");
    } catch {
      setExportStatus("error");
    }
  }

  async function handleCopyExportLink() {
    try {
      setExportStatus("copying");
      const link = `${window.location.origin}/export/my-places`;
      await navigator.clipboard.writeText(link);
      setExportStatus("copied");
    } catch {
      setExportStatus("error");
    }
  }

  function handleSortChange(e) {
    const key = e.target.value;

    if (key === "title") onToggleSortByTitle();
    if (key === "status") onToggleSortByStatus();
    if (key === "plannedDate") onToggleSortByPlannedDate();
    if (key === "createdAt") onToggleSortByCreatedAt();
  }

  function handleSortClick() {
    const key = sortState.key;

    if (key === "title") onToggleSortByTitle();
    if (key === "status") onToggleSortByStatus();
    if (key === "plannedDate") onToggleSortByPlannedDate();
    if (key === "createdAt") onToggleSortByCreatedAt();
  }

  return (
    <section className="places-category" aria-busy={isLoading}>
      <div className="places-header">
        <h2>My Places</h2>

        <div className="places-actions">
          <button
            type="button"
            className={`fav-filter-btn ${favoriteOnly ? "active" : ""}`}
            onClick={() => setFavoriteOnly(!favoriteOnly)}
            aria-pressed={favoriteOnly}
            disabled={isLoading}
          >
            {favoriteOnly ? "⭐ Favorites" : "☆ Favorites"}
          </button>

          <select
            className="sort-dropdown"
            value={sortState.key}
            onChange={handleSortChange}
            onClick={handleSortClick}
            disabled={isLoading}
          >
            <option value="createdAt">Recently added</option>
            <option value="title">Title</option>
            <option value="plannedDate">Planned date</option>
            <option value="status">Status</option>
          </select>

          <button
            type="button"
            className="sort-btn secondary"
            onClick={onResetFiltersAndSort}
            disabled={isLoading}
          >
            Reset
          </button>

          <button
            type="button"
            className="export-btn"
            onClick={handleExportDownload}
            disabled={!hasAnyPlaces || isLoading}
          >
            Download JSON
          </button>

          <button
            type="button"
            className="export-btn secondary"
            onClick={handleCopyExportLink}
            disabled={!hasAnyPlaces || isLoading}
          >
            Copy export link
          </button>
        </div>
      </div>

      {exportStatus === "downloading" && (
        <p className="fallback-text">Preparing download…</p>
      )}

      {exportStatus === "downloaded" && (
        <p className="fallback-text success">
          Collection exported successfully.
        </p>
      )}

      {exportStatus === "copying" && (
        <p className="fallback-text">Copying export link…</p>
      )}

      {exportStatus === "copied" && (
        <p className="fallback-text success">
          Export link copied to clipboard.
        </p>
      )}

      {exportStatus === "error" && (
        <p className="fallback-text error">Export failed. Please try again.</p>
      )}

      {isLoading && (
        <p className="fallback-text" role="status">
          Loading your places…
        </p>
      )}

      {!isLoading && !hasAnyPlaces && (
        <p className="fallback-text">
          No places yet. Add one from the list below.
        </p>
      )}

      {!isLoading && hasAnyPlaces && (
        <PlacesList
          places={places}
          onSelectPlace={onSelectPlace}
          onToggleStatus={onToggleStatus}
          onToggleFavorite={onToggleFavorite}
          onOpenNotes={onOpenNotes}
          disabled={isLoading}
          showMapPreview={MAP_PREVIEW_ENABLED}
          highlightedPlaceId={recentlyAddedPlaceId}
        />
      )}
    </section>
  );
}
