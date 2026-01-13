import { useState, useEffect } from "react";

export default function ModalEditorNotes({
  open,
  notes,
  plannedDate,
  onSave,
  onClose,
}) {
  const [localNotes, setLocalNotes] = useState(notes || "");
  const [localDate, setLocalDate] = useState(plannedDate || "");

  useEffect(() => {
    if (open) {
      setLocalNotes(notes || "");
      setLocalDate(plannedDate || "");
    }
  }, [open, notes, plannedDate]);

  if (!open) return null;

  function handleSave() {
    if (!onSave) return;
    onSave({
      notes: localNotes,
      plannedDate: localDate || null,
    });
  }

  return (
    <div className="notes-modal-overlay" role="dialog">
      <div className="notes-modal">
        <h2>Edit Notes</h2>

        <textarea
          value={localNotes}
          placeholder="Write notes..."
          onChange={(e) => setLocalNotes(e.target.value)}
        />

        <input
          type="date"
          value={localDate || ""}
          onChange={(e) => setLocalDate(e.target.value)}
        />

        <div className="btn-row">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
