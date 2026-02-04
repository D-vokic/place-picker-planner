import PlacesList from "../components/PlacesList.jsx";
import SearchInput from "../components/SearchInput.jsx";

export default function MyPlacesView({
  places,
  isLoading,
  filterState,
  setFilterState,
  sortState,
  onToggleSort,
  onResetFiltersAndSort,
  onToggleFavorite,
  onToggleStatus,
  onOpenNotes,
  onSelectPlace,
  recentlyAddedPlaceId,
}) {
  function toggleStatusFilter(status) {
    setFilterState((s) => ({
      ...s,
      status: s.status.includes(status)
        ? s.status.filter((v) => v !== status)
        : [...s.status, status],
    }));
  }

  function handleSortChange(e) {
    const value = e.target.value;

    if (value === "plannedDate") {
      onToggleSort("plannedDate");
      return;
    }

    if (value.endsWith("-desc")) {
      onToggleSort(value.replace("-desc", ""));
      return;
    }

    onToggleSort(value);
  }

  function getSelectValue() {
    if (sortState.key === "title" && sortState.direction === "desc") {
      return "title-desc";
    }
    return sortState.key;
  }

  const showNoResults = !isLoading && places.length === 0;

  return (
    <section className="places-category">
      <h2>My Places</h2>

      <div className="controls-grid">
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={filterState.status.includes("want")}
              onChange={() => toggleStatusFilter("want")}
            />
            Want
          </label>
          <label>
            <input
              type="checkbox"
              checked={filterState.status.includes("visited")}
              onChange={() => toggleStatusFilter("visited")}
            />
            Visited
          </label>
          <label>
            <input
              type="checkbox"
              checked={filterState.favoritesOnly}
              onChange={() =>
                setFilterState((s) => ({
                  ...s,
                  favoritesOnly: !s.favoritesOnly,
                }))
              }
            />
            Favorites
          </label>
        </div>

        <SearchInput
          value={filterState.search}
          onChange={(value) => setFilterState((s) => ({ ...s, search: value }))}
        />

        <select value={getSelectValue()} onChange={handleSortChange}>
          <option value="createdAt">Recently added</option>
          <option value="title">Title (A–Z)</option>
          <option value="title-desc">Title (Z–A)</option>
          <option value="plannedDate">Planned date</option>
          <option value="status">Status</option>
        </select>

        <button type="button" onClick={onResetFiltersAndSort}>
          Reset
        </button>
      </div>

      {showNoResults && (
        <p className="no-results">No places match the current filters.</p>
      )}

      {!showNoResults && (
        <PlacesList
          places={places}
          onSelectPlace={onSelectPlace}
          onToggleFavorite={onToggleFavorite}
          onToggleStatus={onToggleStatus}
          onOpenNotes={onOpenNotes}
          disabled={isLoading}
          highlightedPlaceId={recentlyAddedPlaceId}
        />
      )}
    </section>
  );
}
