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

const initialState = {
  userPlaces: [],
  isLoadingUserPlaces: true,
  modalIsOpen: false,
};

function placesReducer(state, action) {
  switch (action.type) {
    case "LOAD_USER_PLACES":
      return {
        ...state,
        userPlaces: action.places.map((p) => ({
          ...p,
          status: "want",
          isFavorite: Boolean(p.isFavorite),
        })),
        isLoadingUserPlaces: false,
      };

    case "RESET_USER_STATE":
      return {
        ...state,
        userPlaces: [],
        isLoadingUserPlaces: false,
        modalIsOpen: false,
      };

    case "OPEN_DELETE_MODAL":
      return { ...state, modalIsOpen: true };

    case "CLOSE_DELETE_MODAL":
      return { ...state, modalIsOpen: false };

    case "ADD_PLACE_OPTIMISTIC":
      if (state.userPlaces.some((p) => p.id === action.place.id)) return state;
      return {
        ...state,
        userPlaces: [
          {
            ...action.place,
            status: "want",
            isFavorite: false,
            meta: {
              notes: "",
              plannedDate: null,
            },
          },
          ...state.userPlaces,
        ],
      };

    case "REMOVE_PLACE_OPTIMISTIC":
      return {
        ...state,
        userPlaces: state.userPlaces.filter((p) => p.id !== action.placeId),
      };

    case "TOGGLE_STATUS_OPTIMISTIC":
      return {
        ...state,
        userPlaces: state.userPlaces.map((p) =>
          p.id === action.placeId
            ? { ...p, status: p.status === "visited" ? "want" : "visited" }
            : p,
        ),
      };

    case "TOGGLE_FAVORITE_OPTIMISTIC":
      return {
        ...state,
        userPlaces: state.userPlaces.map((p) =>
          p.id === action.placeId ? { ...p, isFavorite: !p.isFavorite } : p,
        ),
      };

    case "UPDATE_META_OPTIMISTIC":
      return {
        ...state,
        userPlaces: state.userPlaces.map((p) =>
          p.id === action.placeId
            ? {
                ...p,
                meta: {
                  ...(p.meta || {}),
                  ...action.data,
                },
              }
            : p,
        ),
      };

    case "SYNC_USER_PLACES":
      return {
        ...state,
        userPlaces: action.places.map((p) => ({
          ...p,
          isFavorite: Boolean(p.isFavorite),
        })),
      };

    default:
      return state;
  }
}

function App() {
  const selectedPlace = useRef(null);
  const notesPlace = useRef(null);

  const [state, dispatch] = useReducer(placesReducer, initialState);

  const [email, setEmail] = useState("");
  const [isAuthConfirmed, setIsAuthConfirmed] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);

  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [recentlyAddedPlaceId, setRecentlyAddedPlaceId] = useState(null);
  const [notesModalOpen, setNotesModalOpen] = useState(false);

  const { userPlaces, isLoadingUserPlaces, modalIsOpen } = state;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const isEmailValid = emailPattern.test(email);
  const authEnabled = isAuthConfirmed;

  useEffect(() => {
    if (!authEnabled) {
      dispatch({ type: "RESET_USER_STATE" });
      return;
    }

    async function loadUserPlaces() {
      try {
        const data = await fetchUserPlaces();
        dispatch({ type: "LOAD_USER_PLACES", places: data.places });
      } catch {
        dispatch({ type: "RESET_USER_STATE" });
      }
    }

    loadUserPlaces();
  }, [authEnabled]);

  const sortedUserPlaces = useMemo(() => {
    return [...userPlaces].sort((a, b) => {
      if (a.isFavorite === b.isFavorite) return 0;
      return a.isFavorite ? -1 : 1;
    });
  }, [userPlaces]);

  const filteredUserPlaces = useMemo(() => {
    return favoriteOnly
      ? sortedUserPlaces.filter((p) => p.isFavorite)
      : sortedUserPlaces;
  }, [sortedUserPlaces, favoriteOnly]);

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
    if (!authEnabled) return;
    selectedPlace.current = place;
    dispatch({ type: "OPEN_DELETE_MODAL" });
  }

  function handleStopRemovePlace() {
    selectedPlace.current = null;
    dispatch({ type: "CLOSE_DELETE_MODAL" });
  }

  async function handleSelectPlace(place) {
    if (!authEnabled) return;

    if (favoriteOnly) setFavoriteOnly(false);

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
    if (!authEnabled) return;
    dispatch({ type: "TOGGLE_STATUS_OPTIMISTIC", placeId });
    try {
      await togglePlaceStatus(placeId);
    } catch {
      const data = await fetchUserPlaces();
      dispatch({ type: "SYNC_USER_PLACES", places: data.places });
    }
  }

  async function handleToggleFavorite(placeId) {
    if (!authEnabled) return;
    dispatch({ type: "TOGGLE_FAVORITE_OPTIMISTIC", placeId });
    try {
      await togglePlaceFavorite(placeId);
    } catch {
      const data = await fetchUserPlaces();
      dispatch({ type: "SYNC_USER_PLACES", places: data.places });
    }
  }

  const handleRemovePlace = useCallback(
    async function () {
      if (!selectedPlace.current || !authEnabled) return;
      const placeId = selectedPlace.current.id;
      dispatch({ type: "REMOVE_PLACE_OPTIMISTIC", placeId });
      dispatch({ type: "CLOSE_DELETE_MODAL" });
      selectedPlace.current = null;
      try {
        await removeUserPlace(placeId);
      } catch {
        const data = await fetchUserPlaces();
        dispatch({ type: "SYNC_USER_PLACES", places: data.places });
      }
    },
    [authEnabled],
  );

  function handleOpenNotes(place) {
    if (!authEnabled) return;
    notesPlace.current = place;
    setNotesModalOpen(true);
  }

  async function handleSaveNotes(data) {
    // console.log("HANDLE SAVE NOTES", data, notesPlace.current);
    const placeId = notesPlace.current?.id;
    notesPlace.current = null;
    setNotesModalOpen(false);

    dispatch({ type: "UPDATE_META_OPTIMISTIC", placeId, data });

    try {
      await updatePlaceMeta(placeId, data);
    } catch {
      const result = await fetchUserPlaces();
      dispatch({ type: "SYNC_USER_PLACES", places: result.places });
    }
  }

  return (
    <BrowserRouter>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <ModalEditorNotes
        open={notesModalOpen}
        notes={notesPlace.current?.meta?.notes}
        plannedDate={notesPlace.current?.meta?.plannedDate}
        onSave={handleSaveNotes}
        onClose={() => setNotesModalOpen(false)}
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <header>
                <img src={logoImg} alt="Place Picker Planner logo" />
                <h1>Place Picker Planner</h1>
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
                  <p className="error center">
                    Please enter a valid email address (e.g. name@example.com).
                  </p>
                )}
              </header>

              <main>
                {authEnabled ? (
                  <MyPlacesView
                    places={filteredUserPlaces}
                    isLoading={isLoadingUserPlaces}
                    onSelectPlace={handleStartRemovePlace}
                    onToggleStatus={handleToggleStatus}
                    onToggleFavorite={handleToggleFavorite}
                    onOpenNotes={handleOpenNotes}
                    favoriteOnly={favoriteOnly}
                    setFavoriteOnly={setFavoriteOnly}
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
                  onSelectPlace={authEnabled ? handleSelectPlace : undefined}
                  onOpenNotes={authEnabled ? handleOpenNotes : undefined}
                />
              </main>
            </>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
