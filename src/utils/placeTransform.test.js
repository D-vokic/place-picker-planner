import { describe, it, expect } from "vitest";
import { applyFilters, applySorting } from "./placeTransform.js";

const basePlaces = [
  {
    id: 1,
    title: "Rome",
    status: "want",
    isFavorite: true,
    createdAt: "2024-01-01",
    meta: { notes: "Italy trip", plannedDate: "2026-06-01" },
  },
  {
    id: 2,
    title: "Paris",
    status: "visited",
    isFavorite: false,
    createdAt: "2023-05-01",
    meta: { notes: "Already seen" },
  },
  {
    id: 3,
    title: "Berlin",
    status: "want",
    isFavorite: false,
    createdAt: "2025-02-01",
    meta: {},
  },
];

describe("applyFilters", () => {
  it("filters by status", () => {
    const result = applyFilters(basePlaces, {
      status: ["want"],
      favoritesOnly: false,
      plannedDate: { mode: "any", value: null },
      search: "",
    });

    expect(result.map((p) => p.id)).toEqual([1, 3]);
  });

  it("filters favorites only", () => {
    const result = applyFilters(basePlaces, {
      status: [],
      favoritesOnly: true,
      plannedDate: { mode: "any", value: null },
      search: "",
    });

    expect(result.map((p) => p.id)).toEqual([1]);
  });

  it("filters places with planned date", () => {
    const result = applyFilters(basePlaces, {
      status: [],
      favoritesOnly: false,
      plannedDate: { mode: "with-date", value: null },
      search: "",
    });

    expect(result.map((p) => p.id)).toEqual([1]);
  });

  it("filters places before a planned date", () => {
    const result = applyFilters(basePlaces, {
      status: [],
      favoritesOnly: false,
      plannedDate: { mode: "before", value: "2026-12-01" },
      search: "",
    });

    expect(result.map((p) => p.id)).toEqual([1]);
  });

  it("filters by search in title or notes", () => {
    const result = applyFilters(basePlaces, {
      status: [],
      favoritesOnly: false,
      plannedDate: { mode: "any", value: null },
      search: "italy",
    });

    expect(result.map((p) => p.id)).toEqual([1]);
  });
});

describe("applySorting", () => {
  it("always sorts favorites first", () => {
    const result = applySorting(basePlaces, {
      key: "title",
      direction: "asc",
    });

    expect(result[0].id).toBe(1);
  });

  it("sorts by title within favorite / non-favorite groups", () => {
    const result = applySorting(basePlaces, {
      key: "title",
      direction: "asc",
    });

    expect(result.map((p) => p.title)).toEqual([
      "Rome", // favorite first
      "Berlin", // then non-favorites sorted by title
      "Paris",
    ]);
  });

  it("sorts by status within favorite / non-favorite groups", () => {
    const result = applySorting(basePlaces, {
      key: "status",
      direction: "asc",
    });

    expect(result.map((p) => p.status)).toEqual(["want", "want", "visited"]);
  });

  it("sorts by planned date with favorites first", () => {
    const result = applySorting(basePlaces, {
      key: "plannedDate",
      direction: "asc",
    });

    expect(result.map((p) => p.id)).toEqual([1, 2, 3]);
  });

  it("sorts by createdAt within favorite / non-favorite groups", () => {
    const result = applySorting(basePlaces, {
      key: "createdAt",
      direction: "asc",
    });

    expect(result.map((p) => p.id)).toEqual([
      1, // favorite always first
      2, // then non-favorites by date
      3,
    ]);
  });
});
