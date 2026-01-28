export function applyFilters(places, filterState) {
  return places.filter((p) => {
    if (filterState.status.length > 0 && !filterState.status.includes(p.status))
      return false;

    if (filterState.favoritesOnly && !p.isFavorite) return false;

    const pd = p.meta?.plannedDate;

    if (filterState.plannedDate.mode === "with-date" && !pd) return false;
    if (filterState.plannedDate.mode === "without-date" && pd) return false;

    if (
      filterState.plannedDate.mode === "before" &&
      (!pd || pd >= filterState.plannedDate.value)
    )
      return false;

    if (
      filterState.plannedDate.mode === "after" &&
      (!pd || pd <= filterState.plannedDate.value)
    )
      return false;

    if (filterState.search) {
      const q = filterState.search.toLowerCase();
      if (
        !p.title.toLowerCase().includes(q) &&
        !p.meta?.notes?.toLowerCase().includes(q)
      )
        return false;
    }

    return true;
  });
}

export function applySorting(places, sortState) {
  return [...places].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }

    switch (sortState.key) {
      case "title": {
        const cmp = a.title.localeCompare(b.title);
        return sortState.direction === "asc" ? cmp : -cmp;
      }
      case "status": {
        const order =
          sortState.direction === "asc"
            ? ["want", "visited"]
            : ["visited", "want"];
        return order.indexOf(a.status) - order.indexOf(b.status);
      }
      case "plannedDate": {
        const aDate = a.meta?.plannedDate
          ? new Date(a.meta.plannedDate).getTime()
          : Infinity;
        const bDate = b.meta?.plannedDate
          ? new Date(b.meta.plannedDate).getTime()
          : Infinity;
        return sortState.direction === "asc" ? aDate - bDate : bDate - aDate;
      }
      case "createdAt": {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortState.direction === "asc" ? aTime - bTime : bTime - aTime;
      }
      default:
        return 0;
    }
  });
}
