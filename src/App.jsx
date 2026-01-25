import {
  useRef,
  useEffect,
  useCallback,
  useReducer,
  useState,
  useMemo,
} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MyPlacesView from "./views/MyPlacesView.jsx";
import AvailablePlacesView from "./views/AvailablePlacesView.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import ModalEditorNotes from "./components/ModalEditorNotes.jsx";
import ErrorPage from "./components/ErrorPage.jsx";

import logoImg from "./assets/logoImg.svg";

import {
  fetchUserPlaces,
  addUserPlace,
  removeUserPlace,
  togglePlaceStatus,
  togglePlaceFavorite,
  updatePlaceMeta,
} from "./utils/api.js";

const RESET_STATUS_ON_LOAD =
  import.meta.env.VITE_RESET_STATUS_ON_LOAD === "true";

const initialState = {
  userPlaces: [],
  isLoadingUserPlaces: true,
  isDeleteModalOpen: false,
  lastError: null,
};

function placesReducer(state, action) {
  switch (action.type) {
    case "LOAD_USER_PLACES":
      return {
        ...state,
        userPlaces: action.places.map((place) => ({
          ...place,
          status: RESET_STATUS_ON_LOAD ? "want" : place.status,
          isFavorite: Boolean(place.isFavorite),
        })),
        isLoadingUserPlaces: false,
        lastError: null,
      };

    case "RESET_USER_STATE":
      return {
        ...state,
        userPlaces: [],
        isLoadingUserPlaces: false,
        isDeleteModalOpen: false,
        lastError: null,
      };

    case "SET_DELETE_MODAL":
      return {
        ...state,
        isDeleteModalOpen: action.open,
      };

    case "ADD_PLACE_OPTIMISTIC":
      if (state.userPlaces.some((p) => p.id === action.place.id)) return state;
      return {
        ...state,
        userPlaces: [
          {
            ...action.place,
            status: "want",
            isFavorite: false,
            meta: { notes: "", plannedDate: null },
          },
          ...state.userPlaces,
        ],
      };

    case "REMOVE_PLACE_OPTIMISTIC":
      return {
        ...state,
        userPlaces: state.userPlaces.filter(
          (place) => place.id !== action.placeId,
        ),
      };

    case "TOGGLE_STATUS_OPTIMISTIC":
      return {
        ...state,
        userPlaces: state.userPlaces.map((place) =>
          place.id === action.placeId
            ? {
                ...place,
                status: place.status === "visited" ? "want" : "visited",
              }
            : place,
        ),
      };

    case "TOGGLE_FAVORITE_OPTIMISTIC":
      return {
        ...state,
        userPlaces: state.userPlaces.map((place) =>
          place.id === action.placeId
            ? { ...place, isFavorite: !place.isFavorite }
            : place,
        ),
      };

    case "UPDATE_META_OPTIMISTIC":
      return {
        ...state,
        userPlaces: state.userPlaces.map((place) =>
          place.id === action.placeId
            ? {
                ...place,
                meta: { ...(place.meta || {}), ...action.data },
              }
            : place,
        ),
      };

    case "SYNC_USER_PLACES":
      return {
        ...state,
        userPlaces: action.places.map((place) => ({
          ...place,
          isFavorite: Boolean(place.isFavorite),
        })),
      };

    default:
      return state;
  }
}

function App() {
  const placePendingDeletion = useRef(null);
  const selectedNotesPlace = useRef(null);

  const [placesState, dispatch] = useReducer(placesReducer, initialState);

  const [email, setEmail] = useState("");
  const [isAuthConfirmed, setIsAuthConfirmed] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);

  const [filterState, setFilterState] = useState({
    status: "all",
    favoritesOnly: false,
    plannedDate: { mode: "any", value: null },
    search: "",
  });

  const [recentlyAddedPlaceId, setRecentlyAddedPlaceId] = useState(null);
  const [notesModalOpen, setNotesModalOpen] = useState(false);

  const { userPlaces, isLoadingUserPlaces, isDeleteModalOpen } = placesState;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const isEmailValid = emailPattern.test(email);
  const editModeEnabled = isAuthConfirmed;

  useEffect(() => {
    if (!editModeEnabled) {
      dispatch({ type: "RESET_USER_STATE" });
      return;
    }

    async function loadUserPlaces() {
      const data = await fetchUserPlaces();
      dispatch({ type: "LOAD_USER_PLACES", places: data.places });
    }

    loadUserPlaces();
  }, [editModeEnabled]);

  const filteredUserPlaces = useMemo(() => {
    let result = [...userPlaces];

    if (filterState.status !== "all") {
      result = result.filter((p) => p.status === filterState.status);
    }

    if (filterState.favoritesOnly) {
      result = result.filter((p) => p.isFavorite);
    }

    if (filterState.plannedDate.mode === "with-date") {
      result = result.filter((p) => p.meta?.plannedDate);
    }

    if (filterState.plannedDate.mode === "without-date") {
      result = result.filter((p) => !p.meta?.plannedDate);
    }

    if (
      filterState.plannedDate.mode === "before" &&
      filterState.plannedDate.value
    ) {
      result = result.filter(
        (p) =>
          p.meta?.plannedDate &&
          p.meta.plannedDate < filterState.plannedDate.value,
      );
    }

    if (
      filterState.plannedDate.mode === "after" &&
      filterState.plannedDate.value
    ) {
      result = result.filter(
        (p) =>
          p.meta?.plannedDate &&
          p.meta.plannedDate > filterState.plannedDate.value,
      );
    }

    if (filterState.search) {
      const q = filterState.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.meta?.notes?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [userPlaces, filterState]);

  function handleEmailSubmit(e) {
    e.preventDefault();
    if (!isEmailValid) {
      setShowEmailError(true);
      setIsAuthConfirmed(false);
      dispatch({ type: "RESET_USER_STATE" });
      return;
    }
    setShowEmailError(false);
    setIsAuthConfirmed(true);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
    setShowEmailError(false);
    if (isAuthConfirmed) {
      setIsAuthConfirmed(false);
      dispatch({ type: "RESET_USER_STATE" });
    }
  }

  function handleStartRemovePlace(place) {
    if (!editModeEnabled) return;
    placePendingDeletion.current = place;
    dispatch({ type: "SET_DELETE_MODAL", open: true });
  }

  function handleStopRemovePlace() {
    placePendingDeletion.current = null;
    dispatch({ type: "SET_DELETE_MODAL", open: false });
  }

  async function handleSelectPlace(place) {
    if (!editModeEnabled) return;

    dispatch({ type: "ADD_PLACE_OPTIMISTIC", place });
    setRecentlyAddedPlaceId(place.id);

    try {
      await addUserPlace(place);
    } catch {
      const data = await fetchUserPlaces();
      dispatch({ type: "SYNC_USER_PLACES", places: data.places });
    }

    setTimeout(() => {
      setRecentlyAddedPlaceId(null);
    }, 700);
  }

  async function handleToggleStatus(placeId) {
    if (!editModeEnabled) return;
    dispatch({ type: "TOGGLE_STATUS_OPTIMISTIC", placeId });
    await togglePlaceStatus(placeId);
  }

  async function handleToggleFavorite(placeId) {
    if (!editModeEnabled) return;
    dispatch({ type: "TOGGLE_FAVORITE_OPTIMISTIC", placeId });
    await togglePlaceFavorite(placeId);
  }

  const handleRemovePlace = useCallback(async () => {
    if (!placePendingDeletion.current || !editModeEnabled) return;
    const placeId = placePendingDeletion.current.id;
    dispatch({ type: "REMOVE_PLACE_OPTIMISTIC", placeId });
    dispatch({ type: "SET_DELETE_MODAL", open: false });
    placePendingDeletion.current = null;
    await removeUserPlace(placeId);
  }, [editModeEnabled]);

  function handleOpenNotes(place) {
    if (!editModeEnabled) return;
    selectedNotesPlace.current = place;
    setNotesModalOpen(true);
  }

  async function handleSaveNotes(data) {
    const placeId = selectedNotesPlace.current?.id;
    selectedNotesPlace.current = null;
    setNotesModalOpen(false);
    dispatch({ type: "UPDATE_META_OPTIMISTIC", placeId, data });
    await updatePlaceMeta(placeId, data);
  }

  return (
    <BrowserRouter>
      <header className="app-header">
        <img src={logoImg} alt="Place Picker Planner logo" />
        <h1>PLACE PICKER PLANNER</h1>
        <p>Save and organize places you want to visit.</p>

        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            placeholder="Enter email to enable editing"
            value={email}
            onChange={handleEmailChange}
            aria-invalid={showEmailError}
          />
        </form>

        {showEmailError && (
          <p className="error center">Please enter a valid email address.</p>
        )}
      </header>

      <Modal open={isDeleteModalOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <ModalEditorNotes
        open={notesModalOpen}
        notes={selectedNotesPlace.current?.meta?.notes}
        plannedDate={selectedNotesPlace.current?.meta?.plannedDate}
        onSave={handleSaveNotes}
        onClose={() => setNotesModalOpen(false)}
      />

      <Routes>
        <Route
          path="/"
          element={
            <main>
              {editModeEnabled ? (
                <MyPlacesView
                  places={filteredUserPlaces}
                  isLoading={isLoadingUserPlaces}
                  onSelectPlace={handleStartRemovePlace}
                  onToggleStatus={handleToggleStatus}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenNotes={handleOpenNotes}
                  favoriteOnly={filterState.favoritesOnly}
                  setFavoriteOnly={(v) =>
                    setFilterState((s) => ({ ...s, favoritesOnly: v }))
                  }
                  recentlyAddedPlaceId={recentlyAddedPlaceId}
                />
              ) : (
                <section className="places-category">
                  <h2>My Places</h2>
                  <p className="fallback-text">
                    Enter a valid email address and press Enter to manage your
                    places.
                  </p>
                </section>
              )}

              <AvailablePlacesView
                onSelectPlace={editModeEnabled ? handleSelectPlace : undefined}
                onOpenNotes={editModeEnabled ? handleOpenNotes : undefined}
              />
            </main>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
