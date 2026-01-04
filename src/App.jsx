import { useRef, useEffect, useCallback, useReducer, useState } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logoImg.svg";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import {
  fetchUserPlaces,
  addUserPlace,
  removeUserPlace,
  togglePlaceStatus,
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
        userPlaces: action.places,
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
      if (state.userPlaces.some((p) => p.id === action.place.id)) {
        return state;
      }
      return {
        ...state,
        userPlaces: [{ ...action.place, status: "want" }, ...state.userPlaces],
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
            ? {
                ...p,
                status: p.status === "visited" ? "want" : "visited",
              }
            : p
        ),
      };
    case "SYNC_USER_PLACES":
      return { ...state, userPlaces: action.places };
    default:
      return state;
  }
}

function App() {
  const selectedPlace = useRef(null);
  const [state, dispatch] = useReducer(placesReducer, initialState);

  const [email, setEmail] = useState("");
  const [isAuthConfirmed, setIsAuthConfirmed] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);

  const { userPlaces, isLoadingUserPlaces, modalIsOpen } = state;

  // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    dispatch({ type: "ADD_PLACE_OPTIMISTIC", place });

    try {
      await addUserPlace(place);
    } catch {
      const data = await fetchUserPlaces();
      dispatch({ type: "SYNC_USER_PLACES", places: data.places });
    }
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
    [authEnabled]
  );

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

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
          <Places
            title="My Places"
            places={userPlaces}
            isLoading={isLoadingUserPlaces}
            loadingText="Loading your places..."
            fallbackText="You have not added any places yet."
            onSelectPlace={handleStartRemovePlace}
            onToggleStatus={handleToggleStatus}
          />
        ) : (
          <section className="places-category">
            <h2>My Places</h2>
            <p className="fallback-text">
              Enter a valid email address and press Enter to manage your places.
            </p>
          </section>
        )}

        <AvailablePlaces
          onSelectPlace={authEnabled ? handleSelectPlace : undefined}
        />
      </main>
    </>
  );
}

export default App;
