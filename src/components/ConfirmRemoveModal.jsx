export default function ConfirmRemoveModal({ place, onCancel, onConfirm }) {
  if (!place) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h2>Remove place</h2>
        <p>Are you sure you want to remove:</p>
        <strong>{place.title}</strong>

        <div className="modal-actions">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="danger"
            onClick={() => onConfirm(place.id)}
            data-testid="confirm-delete"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
