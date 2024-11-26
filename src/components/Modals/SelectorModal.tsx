import { KeyboardEvent, useState, useRef, useEffect } from "react";

import "./SelectorModal.css";

type SelectorModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  children: JSX.Element;
};

export function SelectorModal({
  isOpen,
  closeModal,
  children,
}: SelectorModalProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Escape") {
      setModalOpen(false);
      closeModal();
    }
  }

  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isModalOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isModalOpen]);

  return (
    <dialog ref={modalRef} className="modal" onKeyDown={handleKeyDown}>
      {children}
    </dialog>
  );
}
