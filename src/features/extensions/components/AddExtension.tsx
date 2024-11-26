import { useState, useEffect } from "react";

import icon from "@/assets/plus-circle.svg";
import { Program, SelectedProgram } from "@/types/index";
import { SelectorModal } from "@/components/Modals";
import { ExtensionSelector } from "./ExtensionSelector";
import { useSelectedExtension } from "../api/getSelectedExtension";
import "./AddExtension.css";

type AddExtensionProps = {
  extensionList: Program[];
  extension: SelectedProgram | null;
  setExtension: (major: SelectedProgram | null) => void;
};

export function AddExtension({
  extensionList,
  extension,
  setExtension,
}: AddExtensionProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedExtension, setSelectedExtension] = useState<Program | null>(
    null
  );
  function handleClick() {
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
  }

  const id = selectedExtension ? selectedExtension.id : 0;

  const enrichedExtension = useSelectedExtension(id).data?.data;

  useEffect(() => {
    setExtension(enrichedExtension ? enrichedExtension : null);
  }, [enrichedExtension]);

  return (
    <>
      <button
        aria-label="add major"
        id={extension ? "add-extension" : "add-extension-none"}
        type="button"
        onClick={handleClick}
      >
        <span className="button-text">
          {extension ? extension.name : "Add Extension"}
        </span>
        <img className="add-icon" src={icon} />
      </button>
      {isModalOpen ? (
        <SelectorModal isOpen={isModalOpen} closeModal={closeModal}>
          <ExtensionSelector
            extensionList={extensionList}
            setSelectedExtension={setSelectedExtension}
            closeModal={closeModal}
          />
        </SelectorModal>
      ) : null}
    </>
  );
}
