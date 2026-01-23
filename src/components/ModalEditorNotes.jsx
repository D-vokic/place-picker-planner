import { useState, useEffect } from "react";

export default function ModalEditorNotes({
  open,
  notes,
  plannedDate,
  onSave,
  onClose,
}) {
  const [notesDraft, setNotesDraft] = useState("");
  const [dateDraft, setDateDraft] = useState("");

  useEffect(() => {
    if (open) {
      setNotesDraft(notes ?? "");
      setDateDraft(plannedDate ?? "");
    }
  }, [open, notes, plannedDate]);

  if (!open) return null;

  function handleSave() {
    onSave({
      notes: notesDraft,
      plannedDate: dateDraft || null,
    });
    onClose();
  }

  return (
    <div
      className="notes-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notes-title"
    >
      <div className="notes-modal">
        <h2 id="notes-title">Edit Notes</h2>

        <textarea
          value={notesDraft}
          placeholder="Write notes..."
          onChange={(e) => setNotesDraft(e.target.value)}
          aria-label="Notes"
        />

        <input
          type="date"
          value={dateDraft}
          onChange={(e) => setDateDraft(e.target.value)}
          aria-label="Planned visit date"
        />

        <div className="btn-row">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>

          <button type="button" className="btn-save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
