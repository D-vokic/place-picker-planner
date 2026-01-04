import { useRef, useEffect, useCallback, useReducer } from "react";

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

/* ------------------------------------------------------------------ */
/* Reducer & initial state */
/* ------------------------------------------------------------------ */

const initialState = {
  userPlaces: [],
  isLoadingUserPlaces: true,
  modalIsOpen: false,
};

function placesReducer(state, action) {
  switch (action.type) {
    case "LOAD_USER_PLACES": {
      return {
        ...state,
        userPlaces: action.places,
        isLoadingUserPlaces: false,
      };
    }

    case "OPEN_DELETE_MODAL": {
      return {
        ...state,
        modalIsOpen: true,
      };
    }

    case "CLOSE_DELETE_MODAL": {
      return {
        ...state,
        modalIsOpen: false,
      };
    }

    case "ADD_PLACE_OPTIMISTIC": {
      if (state.userPlaces.some((p) => p.id === action.place.id)) {
        return state;
      }

      return {
        ...state,
        userPlaces: [{ ...action.place, status: "want" }, ...state.userPlaces],
      };
    }

    case "REMOVE_PLACE_OPTIMISTIC": {
      return {
        ...state,
        userPlaces: state.userPlaces.filter((p) => p.id !== action.placeId),
      };
    }

    case "TOGGLE_STATUS_OPTIMISTIC": {
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
    }

    case "SYNC_USER_PLACES": {
      return {
        ...state,
        userPlaces: action.places,
      };
    }

    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/* App */
/* ------------------------------------------------------------------ */

function App() {
  const selectedPlace = useRef(null);
  const [state, dispatch] = useReducer(placesReducer, initialState);

  const { userPlaces, isLoadingUserPlaces, modalIsOpen } = state;

  /* ---------------------------------------------------------------- */
  /* Effects */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    async function loadUserPlaces() {
      try {
        const data = await fetchUserPlaces();
        dispatch({
          type: "LOAD_USER_PLACES",
          places: data.places,
        });
      } catch {
        dispatch({
          type: "LOAD_USER_PLACES",
          places: [],
        });
      }
    }

    loadUserPlaces();
  }, []);

  /* ---------------------------------------------------------------- */
  /* Handlers */
  /* ---------------------------------------------------------------- */

  function handleStartRemovePlace(place) {
    selectedPlace.current = place;
    dispatch({ type: "OPEN_DELETE_MODAL" });
  }

  function handleStopRemovePlace() {
    selectedPlace.current = null;
    dispatch({ type: "CLOSE_DELETE_MODAL" });
  }

  async function handleSelectPlace(place) {
    dispatch({
      type: "ADD_PLACE_OPTIMISTIC",
      place,
    });

    try {
      await addUserPlace(place);
    } catch {
      try {
        const data = await fetchUserPlaces();
        dispatch({
          type: "SYNC_USER_PLACES",
          places: data.places,
        });
      } catch {
        // ignore
      }
    }
  }

  async function handleToggleStatus(placeId) {
    dispatch({
      type: "TOGGLE_STATUS_OPTIMISTIC",
      placeId,
    });

    try {
      await togglePlaceStatus(placeId);
    } catch {
      try {
        const data = await fetchUserPlaces();
        dispatch({
          type: "SYNC_USER_PLACES",
          places: data.places,
        });
      } catch {
        // ignore
      }
    }
  }

  const handleRemovePlace = useCallback(async function () {
    if (!selectedPlace.current) return;

    const placeId = selectedPlace.current.id;

    dispatch({
      type: "REMOVE_PLACE_OPTIMISTIC",
      placeId,
    });

    dispatch({ type: "CLOSE_DELETE_MODAL" });
    selectedPlace.current = null;

    try {
      await removeUserPlace(placeId);
    } catch {
      try {
        const data = await fetchUserPlaces();
        dispatch({
          type: "SYNC_USER_PLACES",
          places: data.places,
        });
      } catch {
        // ignore
      }
    }
  }, []);

  /* ---------------------------------------------------------------- */
  /* Render */
  /* ---------------------------------------------------------------- */

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
      </header>

      <main>
        <Places
          title="My Places"
          places={userPlaces}
          isLoading={isLoadingUserPlaces}
          loadingText="Loading your places..."
          fallbackText="You have not added any places yet."
          onSelectPlace={handleStartRemovePlace}
          onToggleStatus={handleToggleStatus}
        />

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
