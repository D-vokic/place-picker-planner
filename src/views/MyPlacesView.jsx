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

        <select
          value={sortState.key}
          onClick={() => onToggleSort(sortState.key)}
          onChange={(e) => onToggleSort(e.target.value)}
        >
          <option value="createdAt">Recently added</option>
          <option value="title">Title</option>
          <option value="plannedDate">Planned date</option>
          <option value="status">Status</option>
        </select>

        <button type="button" onClick={onResetFiltersAndSort}>
          Reset
        </button>
      </div>

      <PlacesList
        places={places}
        onSelectPlace={onSelectPlace}
        onToggleFavorite={onToggleFavorite}
        disabled={isLoading}
        highlightedPlaceId={recentlyAddedPlaceId}
      />
    </section>
  );
}
