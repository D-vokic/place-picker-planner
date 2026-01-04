export default function DeleteConfirmation({ onCancel, onConfirm }) {
  return (
    <div id="delete-confirmation">
      <h2>Remove place</h2>
      <p>
        Are you sure you want to remove this place from your list? This action
        cannot be undone.
      </p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          Cancel
        </button>
        <button onClick={onConfirm} className="button">
          Remove
        </button>
      </div>
    </div>
  );
}
