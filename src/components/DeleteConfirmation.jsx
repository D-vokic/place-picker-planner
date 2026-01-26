export default function DeleteConfirmation({ onCancel, onConfirm }) {
  return (
    <div id="delete-confirmation" role="dialog" aria-modal="true">
      <h2 id="delete-title">Remove place</h2>
      <p id="delete-description">
        Are you sure you want to remove this place from your list? This action
        cannot be undone.
      </p>
      <div className="confirmation-actions">
        <button
          type="button"
          onClick={onCancel}
          className="button-text"
          aria-label="Cancel removal"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="button"
          aria-label="Confirm removal"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
