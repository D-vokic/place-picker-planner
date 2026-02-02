import { useEffect, useReducer, useState, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MyPlacesView from "./views/MyPlacesView.jsx";
import AvailablePlacesView from "./views/AvailablePlacesView.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";

import logoImg from "./assets/logoImg.svg";

import {
  fetchUserPlaces,
  togglePlaceFavorite,
  togglePlaceStatus,
  removeUserPlace,
  addUserPlace,
} from "./utils/api.js";

const INITIAL_FILTER_STATE = {
  status: [],
  favoritesOnly: false,
  plannedDate: { mode: "any", value: null },
  search: "",
};

const INITIAL_SORT_STATE = {
  key: "title",
  direction: "asc",
};

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

export default function App() {
  const [placesState, dispatch] = useReducer(placesReducer, initialState);

  const [email, setEmail] = useState("");
  const [isAuthConfirmed, setIsAuthConfirmed] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);

  const [filterState, setFilterState] = useState(INITIAL_FILTER_STATE);
  const [sortState, setSortState] = useState(INITIAL_SORT_STATE);

  const [selectedPlace, setSelectedPlace] = useState(null);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const isEmailValid = emailPattern.test(email);
  const editModeEnabled = isAuthConfirmed;

  useEffect(() => {
    if (!editModeEnabled) {
      dispatch({ type: "RESET_USER_STATE" });
      return;
    }

    fetchUserPlaces().then((data) =>
      dispatch({ type: "LOAD_USER_PLACES", places: data.places }),
    );
  }, [editModeEnabled]);

  function handleEmailSubmit(e) {
    e.preventDefault();
    if (!isEmailValid) {
      setShowEmailError(true);
      setIsAuthConfirmed(false);
      return;
    }
    setShowEmailError(false);
    setIsAuthConfirmed(true);
  }

  function handleToggleFavorite(placeId) {
    dispatch({ type: "TOGGLE_FAVORITE", placeId });
    togglePlaceFavorite(placeId);
  }

  function handleToggleStatus(placeId) {
    dispatch({ type: "TOGGLE_STATUS", placeId });
    togglePlaceStatus(placeId);
  }

  function handleSelectAvailablePlace(place) {
    dispatch({ type: "ADD_PLACE", place });
    addUserPlace(place);
  }

  function handleSelectPlace(place) {
    setSelectedPlace(place);
  }

  function handleCancelRemove() {
    setSelectedPlace(null);
  }

  function handleConfirmRemove() {
    if (!selectedPlace) return;

    dispatch({ type: "REMOVE_PLACE", placeId: selectedPlace.id });
    removeUserPlace(selectedPlace.id);
    setSelectedPlace(null);
  }

  const filteredPlaces = useMemo(() => {
    let result = [...placesState.userPlaces];

    if (filterState.status.length > 0) {
      result = result.filter((p) => filterState.status.includes(p.status));
    }

    if (filterState.favoritesOnly) {
      result = result.filter((p) => p.isFavorite === true);
    }

    if (filterState.search.trim() !== "") {
      const q = filterState.search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      let aVal = a[sortState.key];
      let bVal = b[sortState.key];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortState.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortState.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [placesState.userPlaces, filterState, sortState]);

  return (
    <BrowserRouter>
      <header className="app-header">
        <img src={logoImg} alt="" />
        <h1>PLACE PICKER PLANNER</h1>
        <p>Save and organize places you want to visit.</p>

        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            placeholder="Enter email to enable editing"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={showEmailError}
          />
        </form>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <main>
              {editModeEnabled && (
                <MyPlacesView
                  places={filteredPlaces}
                  isLoading={placesState.isLoadingUserPlaces}
                  filterState={filterState}
                  setFilterState={setFilterState}
                  sortState={sortState}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleStatus={handleToggleStatus}
                  onSelectPlace={handleSelectPlace}
                  onResetFiltersAndSort={() => {
                    setFilterState(INITIAL_FILTER_STATE);
                    setSortState(INITIAL_SORT_STATE);
                  }}
                  onToggleSort={(key) =>
                    setSortState((s) =>
                      s.key === key
                        ? {
                            key,
                            direction: s.direction === "asc" ? "desc" : "asc",
                          }
                        : { key, direction: "asc" },
                    )
                  }
                />
              )}

              <AvailablePlacesView onSelectPlace={handleSelectAvailablePlace} />
            </main>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      {selectedPlace && (
        <DeleteConfirmation
          onCancel={handleCancelRemove}
          onConfirm={handleConfirmRemove}
        />
      )}
    </BrowserRouter>
  );
}
