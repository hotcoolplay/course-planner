import { useState, useEffect } from "react";

import icon from "@/assets/plus-circle.svg";
import { Major, SelectedMajor } from "@/types/index";
import { SelectorModal } from "@/components/Modals";
import { MajorSelector } from "./MajorSelector";
import { useMajors } from "../api/getMajors";
import { useSelectedMajor } from "../api/getSelectedMajor";
import "./AddMajor.css";

type AddMajorProps = {
  major: SelectedMajor | null;
  setMajor: (major: SelectedMajor | null) => void;
};

export function AddMajor({ major, setMajor }: AddMajorProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  function handleClick() {
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
  }

  const majorList = useMajors().data?.data;

  const id = selectedMajor ? selectedMajor.id : 0;

  const enrichedMajor = useSelectedMajor(id).data?.data;

  useEffect(() => {
    setMajor(enrichedMajor ? enrichedMajor : null);
  }, [enrichedMajor]);

  if (!majorList) return null;

  return (
    <>
      <button
        aria-label="add major"
        id={major ? "add-major" : "add-major-none"}
        type="button"
        onClick={handleClick}
      >
        <span className="button-text">
          {major ? major.name : "Select Major"}
        </span>
        <img className="add-icon" src={icon} />
      </button>
      {isModalOpen ? (
        <SelectorModal isOpen={isModalOpen} closeModal={closeModal}>
          <MajorSelector
            majorList={majorList}
            setSelectedMajor={setSelectedMajor}
            closeModal={closeModal}
          />
        </SelectorModal>
      ) : null}
    </>
  );
}
