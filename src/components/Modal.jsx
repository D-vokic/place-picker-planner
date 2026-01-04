import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

function Modal({ open, children, onClose }) {
  const dialog = useRef();

  useEffect(() => {
    const modal = dialog.current;

    if (!modal) return;

    if (open && !modal.open) {
      modal.showModal();
    }

    if (!open && modal.open) {
      modal.close();
    }
  }, [open]);

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
}

export default Modal;
