import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

function Modal({ open, children, onClose }) {
  const dialogRef = useRef();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return createPortal(
    <dialog
      className="modal"
      ref={dialogRef}
      onClose={onClose}
      aria-modal="true"
    >
      {children}
    </dialog>,
    document.getElementById("modal"),
  );
}

export default Modal;
