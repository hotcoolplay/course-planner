import { useState, useEffect } from "react";
import { useCombobox } from "downshift";
import { Major, SelectedMajor } from "@/types";
import { client } from "@/lib/client";
import down from "@/assets/caret-down.svg";
import up from "@/assets/caret-up.svg";
import "./Combobox.css";

type MajorSelectorProps = {
  setMajor: (prog: SelectedMajor) => void;
};

export function MajorSelector({ setMajor }: MajorSelectorProps) {
  const [majorList, setMajorList] = useState<Major[]>([]);
  useEffect(() => {
    client.get<Major[]>(`/majors`).then((res) => {
      setMajorList(res.data);
    });
  }, []);
  function filterMajors(input: string) {
    const lowerInput = input.toLowerCase();
    return function majorFilter(major: Major) {
      const majorString = major.name.toLowerCase();
      return !lowerInput || majorString.includes(lowerInput);
    };
  }
  const [items, setItems] = useState<Major[]>(majorList);
  const [selectedMajor, setSelectedMajor] = useState<Major>(majorList[0]);
  useEffect(() => {
    client
      .get<SelectedMajor>(
        `/majors/selected-major/${selectedMajor ? selectedMajor.id : 2}`
      )
      .then((res) => {
        setMajor(res.data);
      });
  }, [selectedMajor]);
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      setItems(majorList.filter(filterMajors(inputValue)));
    },
    items,
    onSelectedItemChange({ selectedItem }) {
      setSelectedMajor(selectedItem);
    },
    itemToString(item) {
      return item ? item.name : "";
    },
  });
  return (
    <div className="selector">
      <div id="select-major">
        <label {...getLabelProps()} />
        <div className="combobox-container">
          <input
            className="combobox-input"
            placeholder="Choose major..."
            {...getInputProps()}
          />
          <button
            aria-label="toggle menu"
            className="user-button"
            type="button"
            {...getToggleButtonProps()}
          >
            <img className="toggle" src={isOpen ? up : down} />
          </button>
        </div>
      </div>
      <ul
        className={
          !(isOpen && items.length)
            ? "user-combobox-list-hidden"
            : "user-combobox-list"
        }
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              className={
                highlightedIndex === index
                  ? "user-highlighted-item"
                  : "user-item"
              }
              {...getItemProps({ key: item.id, item, index })}
            >
              {item.name}
            </li>
          ))}
      </ul>
    </div>
  );
}
