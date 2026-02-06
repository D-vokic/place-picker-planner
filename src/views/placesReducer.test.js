import { describe, it, expect } from "vitest";

const initialState = {
  userPlaces: [],
  isLoadingUserPlaces: true,
};

function placesReducer(state, action) {
  switch (action.type) {
    case "LOAD_USER_PLACES":
      return {
        ...state,
        userPlaces: action.places.map((p) => ({
          ...p,
          isFavorite: p.isFavorite === true,
        })),
        isLoadingUserPlaces: false,
      };

    case "ADD_PLACE":
      return {
        ...state,
        userPlaces: [...state.userPlaces, action.place],
      };

    case "TOGGLE_FAVORITE":
      return {
        ...state,
        userPlaces: state.userPlaces.map((p) =>
          p.id === action.placeId ? { ...p, isFavorite: !p.isFavorite } : p,
        ),
      };

    case "TOGGLE_STATUS":
      return {
        ...state,
        userPlaces: state.userPlaces.map((p) =>
          p.id === action.placeId
            ? { ...p, status: p.status === "visited" ? "want" : "visited" }
            : p,
        ),
      };

    case "UPDATE_META":
      return {
        ...state,
        userPlaces: state.userPlaces.map((p) =>
          p.id === action.placeId
            ? { ...p, meta: { ...p.meta, ...action.meta } }
            : p,
        ),
      };

    case "REMOVE_PLACE":
      return {
        ...state,
        userPlaces: state.userPlaces.filter((p) => p.id !== action.placeId),
      };

    case "RESET_USER_STATE":
      return {
        ...state,
        userPlaces: [],
        isLoadingUserPlaces: false,
      };

    default:
      return state;
  }
}

describe("placesReducer", () => {
  it("loads user places and normalizes isFavorite", () => {
    const action = {
      type: "LOAD_USER_PLACES",
      places: [
        { id: 1, title: "Rome", isFavorite: true },
        { id: 2, title: "Paris" },
      ],
    };

    const result = placesReducer(initialState, action);

    expect(result.isLoadingUserPlaces).toBe(false);
    expect(result.userPlaces).toEqual([
      { id: 1, title: "Rome", isFavorite: true },
      { id: 2, title: "Paris", isFavorite: false },
    ]);
  });

  it("adds a new place", () => {
    const place = { id: 1, title: "Berlin" };

    const result = placesReducer(
      { ...initialState, isLoadingUserPlaces: false },
      { type: "ADD_PLACE", place },
    );

    expect(result.userPlaces).toHaveLength(1);
    expect(result.userPlaces[0]).toEqual(place);
  });

  it("toggles favorite flag", () => {
    const state = {
      ...initialState,
      isLoadingUserPlaces: false,
      userPlaces: [{ id: 1, isFavorite: false }],
    };

    const result = placesReducer(state, {
      type: "TOGGLE_FAVORITE",
      placeId: 1,
    });

    expect(result.userPlaces[0].isFavorite).toBe(true);
  });

  it("toggles status between want and visited", () => {
    const state = {
      ...initialState,
      isLoadingUserPlaces: false,
      userPlaces: [{ id: 1, status: "want" }],
    };

    const result = placesReducer(state, {
      type: "TOGGLE_STATUS",
      placeId: 1,
    });

    expect(result.userPlaces[0].status).toBe("visited");
  });

  it("updates meta fields without overwriting existing meta", () => {
    const state = {
      ...initialState,
      isLoadingUserPlaces: false,
      userPlaces: [{ id: 1, meta: { notes: "Nice place", plannedDate: null } }],
    };

    const result = placesReducer(state, {
      type: "UPDATE_META",
      placeId: 1,
      meta: { plannedDate: "2026-06-01" },
    });

    expect(result.userPlaces[0].meta).toEqual({
      notes: "Nice place",
      plannedDate: "2026-06-01",
    });
  });

  it("removes a place by id", () => {
    const state = {
      ...initialState,
      isLoadingUserPlaces: false,
      userPlaces: [{ id: 1 }, { id: 2 }],
    };

    const result = placesReducer(state, {
      type: "REMOVE_PLACE",
      placeId: 1,
    });

    expect(result.userPlaces).toEqual([{ id: 2 }]);
  });

  it("resets user state", () => {
    const state = {
      userPlaces: [{ id: 1 }],
      isLoadingUserPlaces: true,
    };

    const result = placesReducer(state, { type: "RESET_USER_STATE" });

    expect(result.userPlaces).toEqual([]);
    expect(result.isLoadingUserPlaces).toBe(false);
  });

  it("returns state unchanged for unknown action", () => {
    const state = {
      userPlaces: [{ id: 1 }],
      isLoadingUserPlaces: false,
    };

    const result = placesReducer(state, { type: "UNKNOWN" });

    expect(result).toBe(state);
  });
});
