import { useRef, useState, useEffect, useCallback } from "react";

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

function App() {
  const selectedPlace = useRef(null);

  const [userPlaces, setUserPlaces] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoadingUserPlaces, setIsLoadingUserPlaces] = useState(true);

  useEffect(() => {
    async function loadUserPlaces() {
      try {
        const data = await fetchUserPlaces();
        setUserPlaces(data.places);
      } catch {
        setUserPlaces([]);
      }
      setIsLoadingUserPlaces(false);
    }

    loadUserPlaces();
  }, []);

  function handleStartRemovePlace(place) {
    selectedPlace.current = place;
    setModalIsOpen(true);
  }

  function handleStopRemovePlace() {
    selectedPlace.current = null;
    setModalIsOpen(false);
  }

  async function handleSelectPlace(place) {
    setUserPlaces((prev) => {
      if (prev.some((p) => p.id === place.id)) return prev;
      return [{ ...place, status: "want" }, ...prev];
    });

    try {
      await addUserPlace(place);
    } catch {
      setUserPlaces((prev) => prev.filter((p) => p.id !== place.id));
    }
  }

  async function handleToggleStatus(placeId) {
    // optimistic UI toggle
    setUserPlaces((prev) =>
      prev.map((p) =>
        p.id === placeId
          ? { ...p, status: p.status === "visited" ? "want" : "visited" }
          : p
      )
    );

    try {
      await togglePlaceStatus(placeId);
    } catch {
      // rollback by refetching persisted state
      try {
        const data = await fetchUserPlaces();
        setUserPlaces(data.places);
      } catch {
        // ignore
      }
    }
  }

  const handleRemovePlace = useCallback(async function () {
    if (!selectedPlace.current) return;

    const placeId = selectedPlace.current.id;

    setUserPlaces((prev) => prev.filter((p) => p.id !== placeId));
    setModalIsOpen(false);
    selectedPlace.current = null;

    try {
      await removeUserPlace(placeId);
    } catch {
      try {
        const data = await fetchUserPlaces();
        setUserPlaces(data.places);
      } catch {
        // ignore
      }
    }
  }, []);

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
