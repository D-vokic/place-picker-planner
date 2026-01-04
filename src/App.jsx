import { useRef, useState, useCallback } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logoImg.svg";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { addUserPlace, removeUserPlace } from "./utils/api.js";

function App() {
  const selectedPlace = useRef(null);

  const [userPlaces, setUserPlaces] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function handleStartRemovePlace(place) {
    selectedPlace.current = place;
    setModalIsOpen(true);
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
    selectedPlace.current = null;
  }

  async function handleSelectPlace(place) {
    setUserPlaces((prev) => [place, ...prev]);

    try {
      await addUserPlace(place);
    } catch {
      setUserPlaces((prev) => prev.filter((p) => p.id !== place.id));
    }
  }

  const handleRemovePlace = useCallback(async function () {
    if (!selectedPlace.current) {
      setModalIsOpen(false);
      return;
    }

    const placeId = selectedPlace.current.id;

    setUserPlaces((prev) => prev.filter((place) => place.id !== placeId));

    setModalIsOpen(false);
    selectedPlace.current = null;

    try {
      await removeUserPlace(placeId);
    } catch {
      // ignore for now
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
          fallbackText="You have not added any places yet."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
