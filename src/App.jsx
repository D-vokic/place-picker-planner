import { useEffect, useReducer, useState, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/modal.css";

import MyPlacesView from "./views/MyPlacesView.jsx";
import AvailablePlacesView from "./views/AvailablePlacesView.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import ModalEditorNotes from "./components/ModalEditorNotes.jsx";

import logoImg from "./assets/logoImg.svg";

import {
  fetchUserPlaces,
  togglePlaceFavorite,
  togglePlaceStatus,
  removeUserPlace,
  addUserPlace,
  updatePlaceMeta,
} from "./utils/api.js";

const FILTER_STORAGE_KEY = "ppp.filterState";
const SORT_STORAGE_KEY = "ppp.sortState";

const INITIAL_FILTER_STATE = {
  status: [],
  favoritesOnly: false,
  plannedDate: { mode: "any", value: null },
  search: "",
};

const INITIAL_SORT_STATE = {
  key: "createdAt",
  direction: "desc",
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

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [placesState, dispatch] = useReducer(placesReducer, initialState);

  const [email, setEmail] = useState("");
  const [isAuthConfirmed, setIsAuthConfirmed] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);

  const [filterState, setFilterState] = useState(() =>
    loadFromStorage(FILTER_STORAGE_KEY, INITIAL_FILTER_STATE),
  );
  const [sortState, setSortState] = useState(() =>
    loadFromStorage(SORT_STORAGE_KEY, INITIAL_SORT_STATE),
  );

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [notesPlace, setNotesPlace] = useState(null);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const isEmailValid = emailPattern.test(email);

  useEffect(() => {
    if (!isAuthConfirmed) {
      dispatch({ type: "RESET_USER_STATE" });
      return;
    }

    fetchUserPlaces().then((data) =>
      dispatch({ type: "LOAD_USER_PLACES", places: data.places }),
    );
  }, [isAuthConfirmed]);

  useEffect(() => {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filterState));
  }, [filterState]);

  useEffect(() => {
    localStorage.setItem(SORT_STORAGE_KEY, JSON.stringify(sortState));
  }, [sortState]);

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

  const filteredPlaces = useMemo(() => {
    let result = [...placesState.userPlaces];

    if (filterState.status.length > 0) {
      result = result.filter((p) => {
        if (filterState.status.includes("visited") && p.status === "visited") {
          return true;
        }
        if (filterState.status.includes("want") && p.status !== "visited") {
          return true;
        }
        return false;
      });
    }

    if (filterState.favoritesOnly) {
      result = result.filter((p) => p.isFavorite === true);
    }

    if (filterState.search.trim() !== "") {
      const q = filterState.search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      if (sortState.key === "plannedDate") {
        const aHas = Boolean(a.meta?.plannedDate);
        const bHas = Boolean(b.meta?.plannedDate);

        if (aHas !== bHas) {
          return sortState.direction === "asc" ? bHas - aHas : aHas - bHas;
        }

        if (aHas && bHas) {
          return sortState.direction === "asc"
            ? a.meta.plannedDate.localeCompare(b.meta.plannedDate)
            : b.meta.plannedDate.localeCompare(a.meta.plannedDate);
        }

        return 0;
      }

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
              {isAuthConfirmed && (
                <MyPlacesView
                  places={filteredPlaces}
                  isLoading={placesState.isLoadingUserPlaces}
                  filterState={filterState}
                  setFilterState={setFilterState}
                  sortState={sortState}
                  onToggleFavorite={(id) => {
                    dispatch({ type: "TOGGLE_FAVORITE", placeId: id });
                    togglePlaceFavorite(id);
                  }}
                  onToggleStatus={(id) => {
                    dispatch({ type: "TOGGLE_STATUS", placeId: id });
                    togglePlaceStatus(id);
                  }}
                  onOpenNotes={setNotesPlace}
                  onSelectPlace={setSelectedPlace}
                  onConfirmRemove={(id) => {
                    dispatch({ type: "REMOVE_PLACE", placeId: id });
                    removeUserPlace(id);
                    setSelectedPlace(null);
                  }}
                  onResetFiltersAndSort={() => {
                    setFilterState(INITIAL_FILTER_STATE);
                    setSortState(INITIAL_SORT_STATE);
                    localStorage.removeItem(FILTER_STORAGE_KEY);
                    localStorage.removeItem(SORT_STORAGE_KEY);
                  }}
                  onToggleSort={(key) =>
                    setSortState((prev) => {
                      if (prev.key === key) {
                        return {
                          key,
                          direction: prev.direction === "asc" ? "desc" : "asc",
                        };
                      }
                      return {
                        key,
                        direction: key === "createdAt" ? "desc" : "asc",
                      };
                    })
                  }
                  selectedPlace={selectedPlace}
                />
              )}

              <AvailablePlacesView
                onSelectPlace={(place) => {
                  const placeWithTimestamp = {
                    ...place,
                    createdAt: Date.now(),
                  };
                  dispatch({ type: "ADD_PLACE", place: placeWithTimestamp });
                  addUserPlace(placeWithTimestamp);
                }}
              />
            </main>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      {notesPlace && (
        <ModalEditorNotes
          place={notesPlace}
          onCancel={() => setNotesPlace(null)}
          onSave={(id, meta) => {
            dispatch({ type: "UPDATE_META", placeId: id, meta });
            updatePlaceMeta(id, meta);
            setNotesPlace(null);
          }}
        />
      )}
    </BrowserRouter>
  );
}
