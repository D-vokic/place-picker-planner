// import { useState, useEffect } from "react";

// export default function ModalEditorNotes({
//   open,
//   notes,
//   plannedDate,
//   onSave,
//   onClose,
// }) {
//   const [localNotes, setLocalNotes] = useState("");
//   const [localDate, setLocalDate] = useState("");

//   useEffect(() => {
//     if (open) {
//       setLocalNotes(notes ?? "");
//       setLocalDate(plannedDate ?? "");
//     }
//   }, [open, notes, plannedDate]);

//   if (!open) return null;

//   function handleSave() {
//     onSave({
//       notes: localNotes,
//       plannedDate: localDate || null,
//     });
//     onClose();
//   }

//   return (
//     <div className="notes-modal-overlay" role="dialog">
//       <div className="notes-modal">
//         <h2>Edit Notes</h2>

//         <textarea
//           value={localNotes}
//           placeholder="Write notes..."
//           onChange={(e) => setLocalNotes(e.target.value)}
//         />

//         <input
//           type="date"
//           value={localDate}
//           onChange={(e) => setLocalDate(e.target.value)}
//         />

//         <div className="btn-row">
//           <button className="btn-cancel" onClick={onClose}>
//             Cancel
//           </button>

//           <button className="btn-save" onClick={handleSave}>
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

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
    <div className="notes-modal-overlay" role="dialog">
      <div className="notes-modal">
        <h2>Edit Notes</h2>

        <textarea
          value={notesDraft}
          placeholder="Write notes..."
          onChange={(e) => setNotesDraft(e.target.value)}
        />

        <input
          type="date"
          value={dateDraft}
          onChange={(e) => setDateDraft(e.target.value)}
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
