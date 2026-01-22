export default function ConfirmRemoveModal({ place, onCancel, onConfirm }) {
  if (!place) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Remove place</h2>
        <p>Are you sure you want to remove:</p>
        <strong>{place.title}</strong>

        <div className="modal-actions">
          <button onClick={onCancel}>Cancel</button>
          <button className="danger" onClick={() => onConfirm(place.id)}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
